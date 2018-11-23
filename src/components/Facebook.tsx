import * as React from "react";
import FacebookLogin from "react-facebook-login";
import './facebook.css';

interface IState{
  isLoggedIn: boolean,
    userID: any,
    name: any
    email: any,
    picture: any,
  }
  interface IProps{
    callback: any,
  }

export default class Facebook extends React.Component<IProps,IState> {

  constructor(props: any) {
    super(props)
    this.state = {
        isLoggedIn: false,
        userID: "",
        name: "",
        email: "",
        picture: "",
    }
}

  public componentClicked = () => console.log("clicked");

  // Gets the response of the the facebook login and changes states
  public responseFacebook = (response: any) => {
    this.setState({
        isLoggedIn: true,
        userID: response.userID,
        name: response.name,
        email: response.email,
        picture: response.picture.data.url
        
    })
    this.props.callback(response);

  }

  public render() {
    let fbContent;    
    if (this.state.isLoggedIn) {
      fbContent = (
        <div className="youtubeWelcome">
          <img src={this.state.picture} alt={this.state.name}/> Welcome {this.state.name}
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
