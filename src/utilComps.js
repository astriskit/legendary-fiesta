import React, { useEffect, useState, useRef } from "react";

export const Loading = () => (
  <div className="w3-panel w3-light-grey w3-center w3-wide">...loading...</div>
);
export const Error = ({ error }) => (
  <div className="w3-panel w3-red">{JSON.stringify(error)}</div>
);

export function Input({ label, onChange, value = "", type = "", ...rest }) {
  return (
    <div className="w3-container">
      <label>{label}</label>
      <input
        type={type}
        onChange={onChange}
        value={value}
        {...rest}
        className="w3-input"
      />
    </div>
  );
}

export const Select = React.forwardRef(function(
  { label, onChange, value = "", options = [], className = "", ...restProps },
  ref = null
) {
  //option:{key, value}
  let opts = options.map(({ key, value: optValue, title }) => (
    <option
      value={optValue}
      key={key || optValue}
      selected={value == optValue ? true : false}
    >
      {title}
    </option>
  ));
  opts.unshift(
    <option value="" selected={!value ? true : false}>
      Select to unset
    </option>
  );
  return (
    <div className="w3-container">
      <label>{label}</label>
      <select
        ref={ref}
        onChange={onChange}
        {...restProps}
        className="w3-select"
      >
        {opts}
      </select>
    </div>
  );
});

export function Form({
  className = "",
  children = [],
  onSubmit,
  submitLabel = "Ok"
}) {
  let [fieldValues, setField] = useState(() =>
    children.map(({ props: { value = undefined, name = "" } }) => ({
      name,
      value
    }))
  );
  let [dirty, setDirty] = useState(false);
  let [submitting, setSubmitting] = useState(false);
  let [userAlert, setAlert] = useState(undefined);
  useEffect(() => {
    if (!dirty) {
      let oldVals = children.map(({ props: { value = "", name = "" } }) => ({
        name,
        value
      }));
      let newDirty = false;
      for (let i = 0; i < fieldValues.length; i++) {
        if (fieldValues[i].value != oldVals[i].value) {
          newDirty = true;
          break;
        }
      }
      if (newDirty) {
        setDirty(true);
      }
    }
  }, [fieldValues]);
  let onChangeFieldValue = (name, value) => {
    let newFieldValues = fieldValues.map(field => {
      if (field.name === name) {
        field.value = value;
      }
      return field;
    });
    setField(newFieldValues);
  };
  return (
    <div className="w3-container">
      {userAlert && (
        <div className="w3-panel">
          <p>{userAlert}</p>
          <button
            onClick={() => {
              setAlert(undefined);
            }}
          >
            OK
          </button>
        </div>
      )}
      {children.map((field, order) => {
        let {
          props: { getValueFromEvent = e => e.target.value, ...restProps }
        } = field;
        let fieldState = fieldValues.find(
          ({ name }) => name === field.props.name
        );
        let currentValue = fieldState ? fieldState.value : "";
        return (
          <field.type
            key={order}
            {...restProps}
            value={currentValue}
            onChange={e =>
              onChangeFieldValue(
                field.props.name,
                getValueFromEvent ? getValueFromEvent(e) : e
              )
            }
          />
        );
      })}
      <button
        className="w3-btn "
        disabled={!dirty || submitting}
        onClick={async () => {
          try {
            setSubmitting(true);
            await onSubmit(fieldValues);
            setAlert("Successfully saved.");
          } catch (err) {
            console.error(err);
            setAlert(err.message || "Error submitting");
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {submitLabel}
      </button>
      <button
        className="w3-btn "
        disabled={!dirty}
        onClick={() => {
          let initValues = children.map(
            ({ props: { value = undefined, name = "" } }) => ({
              name,
              value
            })
          );
          setField(initValues);
        }}
      >
        Reset
      </button>
    </div>
  );
}

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.columns = props.columns;
    this.state = {
      data: props.data || [],
      loading: props.loading || false,
      error: null
    };
  }

  loadData(searchParams = undefined) {
    if (!this.props.service) return;
    this.setState({ loading: true }, async () => {
      try {
        let data = await this.props.service(searchParams);
        if (this.props.responseFilter) {
          data = this.props.responseFilter(data);
        }
        this.setState({ data, loading: false, error: null });
      } catch (error) {
        this.setState({ error, loading: false });
      }
    });
  }

  componentDidMount() {
    this.loadData();
  }

  componentDidCatch(err) {
    console.error("Error:", err);
  }

  componentWillReceiveProps(props) {
    if (props.data) {
      this.setState({ data: props.data });
    }
    this.columns = props.columns;
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }
    if (!this.state.data.length) {
      return <div className="w3-panel w3-yellow">No data</div>;
    }
    return (
      <div className="w3-responsive w3-card-4">
        <h4 className="w3-panel">{this.props.title}</h4>
        <table className="w3-table-all">
          <thead>
            <tr>
              {this.columns.map((column, index) => {
                return <th key={index}>{column.title || ""}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((record, index) => {
              return (
                <tr key={this.props.rowKey ? this.props.rowKey(record) : index}>
                  {this.columns.map((column, index) => {
                    return (
                      <td
                        key={column.key || index}
                        className={column.className ? column.className : ""}
                      >
                        {column.dataIndex
                          ? record[column.dataIndex]
                          : column.render(record)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
