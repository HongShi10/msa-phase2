import * as React from "react";
import Modal from 'react-responsive-modal';
import youtubeButton from './playbutton.png';

import { FacebookShareButton } from "react-simple-share";

import YouTube from 'react-youtube';


interface IProps {
    currentSong: any
    authenticated: boolean
}

interface IState {
    open: boolean,
}

export default class SongDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false,
        }

        this.updateSong = this.updateSong.bind(this)
        this.getYoutubeId = this.getYoutubeId.bind(this)
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
                    {(authenticated)?
                    <button className="btn  "  onClick={this.onOpenModal} >Edit </button>
                    :""}
                    {(authenticated)?
                    <button className="btn  " onClick={this.deleteSong.bind(this, currentSong.id)} > Delete </button>
                    :""}
                     {(!authenticated)?
                    <button className="btn btn-disabled "  onClick={this.onOpenModal} disabled={true} >Edit </button>
                    :""}
                    {(!authenticated)?
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
                        <div className="form-group">
                            <label>Song Title</label>
                            <input type="text" className="form-control" id="song-edit-title-input" placeholder="Enter Song Title"/>
                        </div>
                        <div className="form-group">
                            <label>Artist</label>
                            <input type="text" className="form-control" id="song-edit-tag-input" placeholder="Enter Artist"/>
                            <small className="form-text text-muted">Artist is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateSong}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    private _onReady(event: any) {
        // access to player in all event handlers via event.target
        event.target.pauseVideo();
      }

      private downloadArt(url: any) {
        window.open(url);
    }


    private getYoutubeId(){
        console.log( this.props.currentSong.youtube)
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = this.props.currentSong.youtube.match(regExp);
        return (match&&match[7].length===11)? match[7] : false;
      }

    // Modal Open
    private onOpenModal = () => {
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

        if (titleInput === null || genreInput === null) {
			return;
		}

        const currentSong = this.props.currentSong
        const url = "https://msaphase2webapp.azurewebsites.net/api/SongItems/" + currentSong.id
        const updatedTitle = titleInput.value
        const updatedTag = genreInput.value
		fetch(url, {
			body: JSON.stringify({
                "height": currentSong.height,
                "id": currentSong.id,
                "tags": updatedTag,
                "title": updatedTitle,
                "youtube": currentSong.youtube,
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