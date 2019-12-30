import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as R from "ramda";
import moment from "moment";

import { Term } from "../types/types";

import AkaTags from "./AkaTags";
import { submitTerm } from "../actions/Elasticsearch";

interface AddTermFormProps {}
interface AddTermFormState {
  term: Term;
  hasSubmitted: boolean;
}
export default class AddTermForm extends React.Component<
  AddTermFormProps,
  AddTermFormState
> {
  constructor(props: AddTermFormProps) {
    super(props);
    this.state = {
      term: {
        name: "",
        aka: [],
        descriptionShort: "",
        descriptionLong: "",
        imageRef: "",
        submitter: "",
        creationDate: moment().format("YYYY-MM-DD")
      },
      hasSubmitted: false
    };

    this.setAka = this.setAka.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setAka = (aka: Array<string>) => {
    this.setState({ term: { ...this.state.term, aka: aka } });
  };

  handleSubmit = (term: Term, actions: any) => {
    submitTerm(Object.assign(term, { aka: this.state.term.aka }));
    actions.setSubmitting(false);
    actions.resetForm();
    this.setState({ hasSubmitted: true });
  };

  renderInputErrors = (errors: any, touched: any) => {
    const errorsFiltered = Object.keys(this.state.term).map((key: string) => {
      return errors[key] && touched[key] ? key : null;
    });

    const hasErrors = !R.isEmpty(R.filter(e => e !== null, errorsFiltered));
    if (hasErrors) {
      return <div className="input-feedback">Fill all required fields </div>;
    }
  };

  render() {
    return (
      <div className="add-term-form">
        <Formik
          initialValues={this.state.term}
          onSubmit={this.handleSubmit}
          validationSchema={Yup.object().shape({
            name: Yup.string().required(),
            aka: Yup.array<string>(),
            descriptionShort: Yup.string().required(),
            descriptionLong: Yup.string().required(),
            imageRef: Yup.string(),
            submitter: Yup.string().required(),
            creationDate: Yup.string().required()
          })}
        >
          {(props: any) => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset
            } = props;

            return (
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Term Name</label>
                <input
                  id="name"
                  placeholder="ie. 'whip'"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name
                      ? "text-input error"
                      : "text-input"
                  }
                />

                <label htmlFor="aka">AKA </label>
                <AkaTags onTagChange={this.setAka} />

                <label htmlFor="descriptionShort">Short Description</label>
                <input
                  id="descriptionShort"
                  placeholder="(to take) a massive fall"
                  type="text"
                  value={values.descriptionShort}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.descriptionShort && touched.descriptionShort
                      ? "text-input error"
                      : "text-input"
                  }
                />

                <label htmlFor="descriptionLong">Use it in a sentence</label>
                <input
                  id="descriptionLong"
                  placeholder="Dude I took a fat whip off the crux of that route"
                  type="text"
                  value={values.descriptionLong}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.descriptionLong && touched.descriptionLong
                      ? "text-input error"
                      : "text-input"
                  }
                />

                <label htmlFor="imageRef">Link to an image</label>
                <input
                  id="imageRef"
                  placeholder="What does it look like?"
                  type="text"
                  value={values.imageRef}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.imageRef && touched.imageRef
                      ? "text-input error"
                      : "text-input"
                  }
                />

                <label htmlFor="submitter">Who are you?</label>
                <input
                  id="submitter"
                  placeholder="Adam Ondra"
                  type="text"
                  value={values.submitter}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.submitter && touched.submitter
                      ? "text-input error"
                      : "text-input"
                  }
                />

                {this.renderInputErrors(errors, touched)}

                <button
                  type="button"
                  className="outline"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || this.state.hasSubmitted}
                >
                  Submit
                </button>
              </form>
            );
          }}
        </Formik>
      </div>
    );
  }
}
