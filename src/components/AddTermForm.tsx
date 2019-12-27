import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import * as R from "ramda";
import moment from "moment";

import { Term } from "../types/types";

export default function AddTermForm() {
  const initialValues: Term = {
    name: "",
    aka: [],
    descriptionShort: "",
    descriptionLong: "",
    imageRef: "",
    submitter: "",
    creationDate: moment().calendar()
  };

  const renderInputErrors = (errors: any, touched: any) => {
    const errorsFiltered = Object.keys(initialValues).map((key: string) => {
      if (errors[key] && touched[key]) {
        return key;
      } else return null;
    });

    const hasErrors = !R.isEmpty(R.filter(f => f !== null, errorsFiltered));
    if (hasErrors) {
      return <div className="input-feedback">Fill all required fields </div>;
    }
  };

  return (
    <div className="add-term-form">
      <Formik
        initialValues={initialValues}
        onSubmit={async (values: Array<string>) => {
          await new Promise(resolve => setTimeout(resolve, 500));
          alert(JSON.stringify(values, null, 2));
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(),
          aka: Yup.array<string>(),
          descriptionShort: Yup.string().required(),
          descriptionLong: Yup.string().required(),
          imageRef: Yup.string(),
          submitter: Yup.string().required()
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
              {renderInputErrors(errors, touched)}
              <button
                type="button"
                className="outline"
                onClick={handleReset}
                disabled={!dirty || isSubmitting}
              >
                Reset
              </button>
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          );
        }}
      </Formik>
    </div>
  );
}
