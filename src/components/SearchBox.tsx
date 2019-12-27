import React from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import { throttle, debounce } from "throttle-debounce";

import AddTermButton from "./AddTermButton";

type Term = {
  name: string;
  aka: Array<string>;
  descriptionShort: string;
  descriptionLong: string;
  imageRef: string;
  submitter: string;
  creationDate: string;
};

type SearchBoxState = {
  value: string;
  suggestions: Array<Term>;
};

type SearchBoxProps = {};

function getImageStyle(ref: string) {
  return {
    backgroundImage: `url(${ref})`
  };
}

function renderSuggestion(suggestion: Term) {
  return (
    <div className="suggestion-content">
      <span
        className="suggestion-image"
        style={getImageStyle(suggestion.imageRef)}
      ></span>
      <div className="suggestion-term-name">
        {suggestion.name}
        <span className="suggestion-term-aka">
          {suggestion.aka.map(s => `"${s}" `)}
        </span>
      </div>
      <div className="suggestion-term-description">
        {suggestion.descriptionLong}
      </div>
    </div>
  );
}

class SearchBox extends React.Component<SearchBoxProps, SearchBoxState> {
  private inputRef: React.RefObject<Autosuggest>;

  constructor(props: SearchBoxProps) {
    super(props);
    this.inputRef = React.createRef<Autosuggest>();
  }

  state = {
    value: "",
    suggestions: []
  };

  onChange = (_: any, { newValue }: { newValue: string }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    if (value.length > 1) {
      axios
        .post("http://localhost:9200/terms/_search", {
          query: {
            multi_match: {
              query: value,
              fields: ["name", "aka"]
            }
          },
          sort: ["_score"]
        })
        .then(res => {
          const results = res.data.hits.hits.map((h: any) => h._source);
          this.setState({ suggestions: results });
        });
    }
  };

  onSuggestionsFetchRequestedDebounced = debounce(
    500,
    this.onSuggestionsFetchRequested
  );
  onSuggestionsFetchRequestedThrottled = throttle(
    500,
    this.onSuggestionsFetchRequested
  );

  onSuggestionsFetchRequestedImproved = ({ value }: { value: string }) => {
    if (value.length < 4) {
      return this.onSuggestionsFetchRequestedThrottled({ value });
    } else {
      return this.onSuggestionsFetchRequestedDebounced({ value });
    }
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

  componentDidMount() {
    const node = this.inputRef.current!;
    node.focus;
  }

  render() {
    const { value, suggestions } = this.state;

    const inputProps = {
      placeholder: "",
      value,
      onChange: this.onChange
    };

    return (
      <div className="search-box">
        <h1>Search for knowledge</h1>
        <Autosuggest
          ref={this.inputRef}
          suggestions={suggestions}
          renderSuggestion={renderSuggestion}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequestedImproved}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={(term: Term) => term.name}
          inputProps={inputProps}
        />
        <AddTermButton />
      </div>
    );
  }
}

export default SearchBox;
