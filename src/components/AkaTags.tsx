import React from "react";
import * as RT from "react-tag-input";
import { WithContext as ReactTags } from "react-tag-input";

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

interface AkaTagsState {
  tags: RT.Tag[];
  suggestions: RT.Tag[];
}

interface AkaTagsProps {
  onTagChange: (tags: Array<string>) => void;
}

export default class AkaTags extends React.Component<
  AkaTagsProps,
  AkaTagsState
> {
  constructor(props: AkaTagsProps) {
    super(props);

    this.state = {
      tags: [],
      suggestions: []
    };
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  handleDelete(i: number) {
    const { tags } = this.state;
    this.setState(
      {
        tags: tags.filter((tag: RT.Tag, index: number) => index !== i)
      },
      () => this.props.onTagChange(this.state.tags.map(t => t.text))
    );
  }

  handleAddition(tag: RT.Tag) {
    this.setState(
      state => ({ tags: [...state.tags, tag] }),
      () => this.props.onTagChange(this.state.tags.map(t => t.text))
    );
  }

  handleDrag(tag: RT.Tag, currPos: number, newPos: number) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    this.setState({ tags: newTags }, () =>
      this.props.onTagChange(this.state.tags.map(t => t.text))
    );
  }

  render() {
    const { tags, suggestions } = this.state;
    return (
      <div>
        <ReactTags
          tags={tags}
          placeholder="ie. 'fall' (type ',' to add another)"
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
        />
      </div>
    );
  }
}
