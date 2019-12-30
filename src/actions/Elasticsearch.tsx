import axios from "axios";
import React from "react";

import * as R from "ramda";
import { Term } from "../types/types";

export const fetchSuggestions = R.curry(
  (component: React.Component, { value }: { value: string }) => {
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
          component.setState({ suggestions: results });
        });
    }
  }
);

export const submitTerm = (term: Term) => {
  axios.post("http://localhost:9200/terms/_doc", JSON.stringify(term), {
    headers: {
      "Content-Type": "application/json"
    }
  });
};
