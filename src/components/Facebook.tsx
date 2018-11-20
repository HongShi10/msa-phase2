import * as React from "react";
import FacebookLogin from "react-facebook-login";
import './facebook.css';



export default class Facebook extends React.Component<{}> {

    public state = {
    isLoggedIn: false,
    userID: "",
    name: "",
    picture: ""
  };

  public componentClicked = () => console.log("clicked");

  public responseFacebook = (response: any) => {
    this.setState({
        isLoggedIn: true,
        userID: response.userID,
        name: response.name,
        picture: response.picture.data.url
    })
  }

  public render() {
    let fbContent;

    if (this.state.isLoggedIn) {
      fbContent = (
        <div >
          <img src={this.state.picture} alt={this.state.name} />
        </div>
      );
    } else {
      fbContent = (
        <FacebookLogin
          appId="2237281829884398"
          autoLoad={true}
          fields="name,email,picture"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          cssClass="btnFacebook"
          />
      );
    }

    return <div>{fbContent}</div>;
 
  }
}
