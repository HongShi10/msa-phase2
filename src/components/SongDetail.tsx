import * as React from "react";
import Modal from 'react-responsive-modal';
import youtubeButton from './playbutton.png';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import { FacebookShareButton } from "react-simple-share";

import YouTube from 'react-youtube';
import { TextField } from '@material-ui/core';


interface IProps {
    currentSong: any
    authenticated: boolean,

}

interface IState {
    open: boolean,
    songSelected: boolean,
    title: any,
    tag: any,
    youtube: any,
   
}

const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#ff6161',
        main: '#ff6161',
        dark: '#ff6161',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff6161',
        main: '#ff6161',
        dark: '#ff6161',
        contrastText: '#000',
      },
    },
  });

export default class SongDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false,
            songSelected: false,
            title: '',
            tag: '',
            youtube: '',
            
        }

        this.updateSong = this.updateSong.bind(this)
        this.getYoutubeId = this.getYoutubeId.bind(this)
        this.setTitle = this.setTitle.bind(this)
        this.setTag = this.setTag.bind(this)
        this.setYoutube = this.setYoutube.bind(this)
        this.initialise = this.initialise.bind(this)
    }
    // Sets states when Modal is clicked
    public initialise(){
        this.setState({
            title: this.props.currentSong.title,
            tag: this.props.currentSong.tags,
            youtube: this.props.currentSong.youtube,
        })
    }
    
	public render() {
        const authenticated = this.props.authenticated
        const currentSong = this.props.currentSong
        const { open } = this.state;
        const opts = {
            height: '390',
            width: '620',
            playerVars: { 
              autoplay: 1
            }
          };
		return (

			<div className="container song-wrapper">
                <div className="row song-img">
                <YouTube
                    videoId={this.getYoutubeId()}
                    opts={opts}
                    onReady={this._onReady}
                />
                </div>
                
                <div className="row song-done-button">
                    <button className="btn  " onClick={this.downloadArt.bind(this, currentSong.url)}>Download Album Art</button>
                    {(authenticated && this.props.currentSong.id!==0)?
                    <button className="btn  "  onClick={this.onOpenModal} >Edit </button>
                    :""}
                    {(authenticated && this.props.currentSong.id!==0)?
                    <button className="btn  " onClick={this.deleteSong.bind(this, currentSong.id)} > Delete </button>
                    :""}
                     {(!authenticated || this.props.currentSong.id === 0)?
                    <button className="btn btn-disabled "  onClick={this.onOpenModal} disabled={true} >Edit </button>
                    :""}
                    {(!authenticated || this.props.currentSong.id === 0)?
                    <button className="btn btn-disabled " onClick={this.deleteSong.bind(this, currentSong.id)} disabled={true}> Delete </button>
                    :""}

                    <button className="playButton"><img className="play" src={youtubeButton} onClick={this.playSong.bind(this, currentSong.youtube)} /></button>
                    <div className="shareButton">
							<FacebookShareButton
							url={currentSong.youtube}
							color="#3B5998"
							size="50px"
						/>
						</div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                    <MuiThemeProvider theme={theme}>

                        <div className="form-group">
                            <label>Song Title</label>
                            <TextField type="text" className="form-control form-control-Modal" id="song-edit-title-input" value={this.state.title} onChange={this.setTitle}/>
                        </div>
                        <div className="form-group">
                            <label>Artist</label>
                            <TextField type="text" className="form-control form-control-Modal" id="song-edit-tag-input" value={this.state.tag} onChange={this.setTag} />
                            <small className="form-text text-muted">Artist is used for search</small>
                        </div>
                        <div className="form-group">
                            <label>Youtube Link</label>
                            <TextField type="text" className="form-control form-control-Modal" id="youtube-tag-input" value={this.state.youtube} onChange={this.setYoutube}/>
                        </div>
                        </MuiThemeProvider>

                        <button type="button" className="btn" onClick={this.updateSong}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // These Methods allow for the update of TextField by changing the states
    public setTitle(e: React.ChangeEvent<HTMLInputElement>) : void {
        this.setState({ 
            title: e.target.value
        });
      }
      public setTag(e: React.ChangeEvent<HTMLInputElement>) : void {
        this.setState({ 
            tag: e.target.value
        });
      }
      public setYoutube(e: React.ChangeEvent<HTMLInputElement>) : void {
        this.setState({ 
            youtube: e.target.value
        });
      }

    private _onReady(event: any) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
      }

      private downloadArt(url: any) {
        window.open(url);
    }


    private getYoutubeId(){

        if(this.props.currentSong.id === 0){
            return;
        }
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = this.props.currentSong.youtube.match(regExp);
        return (match&&match[7].length===11)? match[7] : false;
      }

    // Modal Open
    private onOpenModal = () => {
        this.initialise()
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
	};

    // Open meme image in new tab
    private playSong(youtube: any) {
        window.open(youtube)     
    }
    // DELETE meme30
    private deleteSong(id: any) {
        const url = "https://msaphase2webapp.azurewebsites.net/api/SongItems/" + id

		fetch(url, {
			method: 'DELETE'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error Response
				alert(response.statusText)
			}
			else {
              location.reload()
			}
		  })
    }

    // PUT meme
    private updateSong(){
        const titleInput = document.getElementById("song-edit-title-input") as HTMLInputElement
        const genreInput = document.getElementById("song-edit-tag-input") as HTMLInputElement
        const youtubeInput = document.getElementById("youtube-tag-input") as HTMLInputElement


        if (titleInput === null || genreInput === null || youtubeInput===null) {
			return;
		}

        const currentSong = this.props.currentSong
        const url = "https://msaphase2webapp.azurewebsites.net/api/SongItems/" + currentSong.id
        const updatedTitle = titleInput.value
        const updatedTag = genreInput.value
        const updatedYoutube = youtubeInput.value

		fetch(url, {
			body: JSON.stringify({
                "height": currentSong.height,
                "id": currentSong.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "youtube": updatedYoutube,
                "url": currentSong.url,
                "width": currentSong.width
            }),
			headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
			method: 'PUT'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + " " + url)
			} else {
				location.reload()
			}
		  })
    }
}