import React, { useEffect, useState } from "react";

function searchInChildren(node, searchStr) {
  if (Array.isArray(node)) {
    return node.some(c => searchInChildren(c, searchStr));
  } else if (node["props"]) {
    if (node.props.children) {
      return searchInChildren(node.props.children, searchStr);
    } else {
      return false;
    }
  } else {
    return node
      .toString()
      .toLowerCase()
      .includes(searchStr.toLowerCase());
  }
}

export const Loading = () => (
  <div className="w3-panel w3-center w3-wide w3-xxlarge">...loading...</div>
);

export const Error = ({ error }) => (
  <div className="w3-panel w3-red">{JSON.stringify(error)}</div>
);

export function Input({
  className,
  label,
  onChange,
  value = "",
  type = "",
  ...rest
}) {
  return (
    <div className="w3-container">
      <label>{label}</label>
      <input
        type={type}
        onChange={onChange}
        value={value}
        {...rest}
        className={"w3-input " + className}
      />
    </div>
  );
}
export function Select({
  label,
  onChange,
  value = "",
  options = [],
  className = "",
  ...restProps
}) {
  //option:{key, value}
  let opts = options.map(({ key, value: optValue, title }) => (
    <option value={optValue} key={key || optValue}>
      {title}
    </option>
  ));
  opts.unshift(
    <option value="" key="unset">
      Select to unset
    </option>
  );
  return (
    <div className="w3-container">
      <label>{label}</label>
      <select
        value={value}
        onChange={onChange}
        {...restProps}
        className="w3-select w3-border"
      >
        {opts}
      </select>
    </div>
  );
}
export function Form({
  children = [],
  onSubmit,
  submitLabel = "OK",
  title = "Form"
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
    <div className="w3-container w3-border">
      <div
        style={{ fontWeight: "bold", textAlign: "center", paddingTop: "5px" }}
        className="w3-xlarge"
      >
        {title}
      </div>
      <hr style={{ marginTop: 0 }} />
      {userAlert && (
        <>
          <div className="w3-panel w3-border">
            <p>{userAlert}</p>
            <span
              style={{ marginBottom: "5px" }}
              className="w3-btn w3-border w3-blue w3-small"
              onClick={() => {
                setAlert(undefined);
              }}
            >
              OK
            </span>
          </div>
          <hr />
        </>
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
      <div className="w3-panel w3-center">
        <button
          className="w3-btn w3-border w3-small w3-round w3-text-white w3-blue w3-hover-teal"
          style={{ marginRight: "4px" }}
          disabled={!dirty || submitting}
          onClick={async () => {
            try {
              setSubmitting(true);
              await onSubmit(fieldValues);
              setAlert("Successfully saved.");
            } catch (err) {
              console.error("error while submitting - ", err);
              setAlert("Couldn't complete the operation.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {submitLabel}
        </button>
        <button
          className="w3-btn w3-border w3-small w3-text-white w3-blue w3-hover-teal"
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
    </div>
  );
}

export const Highlight = ({
  match,
  children,
  highClass = "w3-text-deep-orange w3-yellow"
}) => {
  if (typeof children === "number") {
    children = String(children);
  }
  if (
    match &&
    typeof children !== "object" &&
    children
      .toString()
      .toLowerCase()
      .includes(match.toLowerCase())
  ) {
    let target = children.toLowerCase();
    let matcher = match.toLowerCase();
    let parts = target.split(matcher).map(p => p.length);
    let partsEl = [];
    let pointer = 0;
    parts.forEach((part, ind) => {
      let ch1 = children.substr(pointer, pointer + part);
      let ch2 = children.substr(pointer + part, match.length);
      let el = <span key={ind}>{ch1}</span>;
      let hel = (
        <span key={`high-${ind}`} className={highClass}>
          {ch2}
        </span>
      );
      pointer += part + match.length;
      partsEl.push(el);
      partsEl.push(hel);
    });
    return partsEl;
  }
  return children;
};

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data || [],
      loading: props.loading || false,
      error: null,
      columns: props.columns,
      searchStr: ""
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

  componentWillReceiveProps({ data = [], columns = [], loading = false }) {
    let state = { columns, loading };
    if (!this.props.service && data) {
      state.data = data;
    }
    this.setState(state);
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
        <div
          style={{ fontWeight: "bold", textAlign: "center", paddingTop: "3px" }}
          className="w3-xlarge"
        >
          {this.props.title}
        </div>
        <Input
          className="w3-text-teal w3-pale-blue"
          style={{ fontWeight: "bold" }}
          label="Search items"
          onChange={({ target: { value: searchStr } }) =>
            this.setState({ searchStr })
          }
          value={this.state.searchStr}
        />
        <hr />
        <table className="w3-table-all w3-centered w3-hoverable w3-text-teal">
          <thead>
            <tr>
              {this.state.columns.map((column, index) => {
                return <th key={index}>{column.title || ""}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {this.state.data
              .map((record, index) => {
                return (
                  <tr
                    key={this.props.rowKey ? this.props.rowKey(record) : index}
                    className="w3-hover-pale-blue"
                  >
                    {this.state.columns.map((column, index) => {
                      return (
                        <td
                          key={column.key || index}
                          className={column.className ? column.className : ""}
                        >
                          {column.dataIndex ? (
                            <Highlight match={this.state.searchStr}>
                              {record[column.dataIndex]}
                            </Highlight>
                          ) : (
                            column.render(record, index, this.state.searchStr)
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
              .filter(rowEl => {
                if (this.state.searchStr) {
                  return searchInChildren(rowEl, this.state.searchStr);
                } else {
                  return true;
                }
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export function ShowRecord({
  id,
  service,
  title,
  responseFilter = res => res,
  fields = []
}) {
  let [loading, setLoading] = useState(true);
  let [record, setRecord] = useState({});
  useEffect(() => {
    if (service) {
      (async () => {
        try {
          let res = await service(id);
          res = responseFilter(res);
          if (res.error) {
            alert(res.error);
          } else {
            setRecord(res);
          }
        } catch (er) {
          alert("Error in fetching record.");
          console.error(er, "Error in fetching record.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, []);
  if (!service) {
    return null;
  }
  if (loading) {
    return <Loading />;
  }
  if (!record) {
    return <div className="w3-panel w3-yellow">No data found!</div>;
  }
  return (
    <div className="w3-container w3-responsive w3-card">
      <h4 className="w3-panel">{title}</h4>
      {fields.map(fld => {
        let field = record[fld.dataIndex];
        return (
          <div className="w3-container w3-panel w3-light-grey" key={fld.key}>
            <h5>{fld.title || fld.dataIndex.toUpperCase()}</h5>
            <h6>{field}</h6>
          </div>
        );
      })}
    </div>
  );
}
