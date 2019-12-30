import React from "react";
import Autosuggest from "react-autosuggest";
import { throttle, debounce } from "throttle-debounce";

import AddTermButton from "./AddTermButton";

import { Term } from "../types/types";
import { fetchSuggestions } from "../actions/Elasticsearch";

export interface SearchBoxState {
  value: string;
  suggestions: Array<Term>;
}

export interface SearchBoxProps {}

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

  onSuggestionsFetchRequestedImproved = ({ value }: { value: string }) => {
    if (value.length < 4) {
      return throttle(500, fetchSuggestions(this))({ value });
    } else {
      return debounce(500, fetchSuggestions(this))({ value });
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
