/* eslint-disable no-use-before-define */
import React from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import { debounce } from "throttle-debounce";

import "../scss/components/SeachBox.scss";

type Term = {
  name: string;
  aka: Array<string>;
  descriptionShort: string;
  descriptionLong: string;
  imageRef: string;
  submitter: string;
  creationDate: string;
};

type TermList = Array<Term>;

type MyState = {
  value: string;
  suggestions: Array<String>;
};

class SearchBox extends React.Component<{}, MyState> {
  state = {
    value: "",
    suggestions: []
  };

  componentDidUpdate() {
    this.onSuggestionsFetchRequested = debounce(
      500,
      this.onSuggestionsFetchRequested
    );
  }

  renderSuggestion = (term: Term) => {
    return (
      <div className="result">
        <div>{term.name}</div>
      </div>
    );
  };

  onChange = (_: any, { newValue }: { newValue: string }) => {
    this.setState({ value: newValue });
  };

  onSuggestionsFetchRequested = ({ value }: { value: string }) => {
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
  };

  onSuggestionsClearRequested = () => {
    this.setState({ suggestions: [] });
  };

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
        <div className="autosuggest-container">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={(term: Term) => term.name}
            renderSuggestion={this.renderSuggestion}
            inputProps={inputProps}
          />
        </div>
      </div>
    );
  }
}

export default SearchBox;
