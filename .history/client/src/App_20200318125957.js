import React, { Fragment, Component } from "react";
import Axios from "axios";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
    this.GetData = this.GetData.bind(this);
  }
  GetData = async () => {
    try {
      let response = await Axios.get(`http://localhost:8000/`, {
        crossdomain: true
      });
      let data = await response.data;
      this.setState({
        ...this.state,
        data: data
      });
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount() {
    this.GetData();
  }
  shouldComponentUpdate() {
    return this.state.data.length > 0 ? false : true;
  }

  index = 0;
  render() {
    return (
      <Fragment>
        <h1 className='text-primary text-center'>API Example</h1>

        {this.state.data.length > 0 ? (
          <table className='table table-striped'>
            <thead>
              <tr>
                <th scope='col'>#</th>
                <th scope='col'>Name</th>
                <th scope='col'>URL</th>
                <th scope='col'>Price Style</th>
                <th scope='col'>Phone</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(dataItem => {
                this.index += 1;
                return (
                  <Fragment>
                    <tr>
                      <td>{this.index}</td>
                      <td>{dataItem.name}</td>
                      <td>{dataItem.url}</td>
                      <td>{dataItem.address}</td>
                      <td>{dataItem.price_style}</td>
                      <td>{dataItem.phone}</td>
                    </tr>
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        ) : (
          <Fragment>
            <div className='container text-center mt-5'>
              <div
                className='spinner-border text-primary'
                style={{ width: "6rem", height: "6rem" }}
                role='status'
              >
                <span className='sr-only'>Loading...</span>
              </div>
            </div>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

export default App;
