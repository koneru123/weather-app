import React from "react";
import "./form.style.css";

const error = (props) => {
  return (
    <div className="alert alert-warning mx-5 py-3" role="alert">
      Enter a valid City and Country
    </div>
  );
};

const Form = (props) => {
  return (
    <div className="container">
      <form onSubmit={props.loadweather}>
        <div>{props.error ? error() : ""}</div>
        <div className="row py-3">
          <div className="col-md-3 offset-md-2">
            <input
              type="text"
              className="form-control"
              placeholder="City"
              name="city"
              autoComplete="off"
            />
          </div>
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Country"
              name="country"
              autoComplete="off"
              defaultValue="US"
            />
          </div>
          <div className="col-md-3 mt-md-0 mt-2 text-md-left ">
            <button className="btn btn-success">Check the Weather</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Form;