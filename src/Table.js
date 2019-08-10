import React from "react";

const Loading = props => "...loading...";
const Error = ({ error }) => JSON.stringify(error);
class Table extends React.Component {
  state = {
    data: [],
    loading: false,
    error: null
  };

  constructor(props) {
    super(props);
    this.columns = props.columns;
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

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    if (this.state.error) {
      return <Error error={this.state.error} />;
    }
    if (!this.state.data.length) {
      return <div>No data</div>;
    }
    return (
      <table className={this.props.className || ""}>
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
    );
  }
}

export default Table;
