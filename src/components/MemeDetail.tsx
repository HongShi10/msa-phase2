import * as React from "react";
import Modal from 'react-responsive-modal';
import youtubeButton from './playbutton.png';

import { FacebookShareButton } from "react-simple-share";



interface IProps {
    currentMeme: any
}

interface IState {
    open: boolean
}

export default class MemeDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

        this.updateMeme = this.updateMeme.bind(this)
    }

	public render() {
        const currentMeme = this.props.currentMeme
        const { open } = this.state;
		return (
			<div className="container meme-wrapper">
                <div className="row meme-heading">
                    <b>{currentMeme.title}</b>&nbsp;({currentMeme.youtube})
                </div>
                <div className="row meme-img">
                    <img src={currentMeme.url}/>
                </div>
                
                <div className="row meme-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit </div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteMeme.bind(this, currentMeme.id)}>Delete </div>
                    <button className="playButton"><img className="play" src={youtubeButton} onClick={this.downloadMeme.bind(this, currentMeme.youtube)} /></button>
                    <div className="shareButton">
							<FacebookShareButton
							url={currentMeme.youtube}
							color="#3B5998"
							size="50px"
						/>
						</div>
                    

                    
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Song Title</label>
                            <input type="text" className="form-control" id="meme-edit-title-input" placeholder="Enter Song Title"/>
                        </div>
                        <div className="form-group">
                            <label>Artist</label>
                            <input type="text" className="form-control" id="meme-edit-tag-input" placeholder="Enter Artist"/>
                            <small className="form-text text-muted">Artist is used for search</small>
                        </div>
                        <button type="button" className="btn" onClick={this.updateMeme}>Save</button>
                    </form>
                </Modal>
            </div>
		);
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
    private downloadMeme(youtube: any) {
        window.open(youtube)     
    }
    // DELETE meme
    private deleteMeme(id: any) {
        const url = "https://songapiphase2.azurewebsites.net/api/SongItems/" + id

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
    private updateMeme(){
        const titleInput = document.getElementById("meme-edit-title-input") as HTMLInputElement
        const genreInput = document.getElementById("meme-edit-tag-input") as HTMLInputElement

        if (titleInput === null || genreInput === null) {
			return;
		}

        const currentMeme = this.props.currentMeme
        const url = "https://songapiphase2.azurewebsites.net/api/SongItems/" + currentMeme.id
        const updatedTitle = titleInput.value
        const updatedTag = genreInput.value
		fetch(url, {
			body: JSON.stringify({
                "height": currentMeme.height,
                "id": currentMeme.id,
                "genre": updatedTag,
                "title": updatedTitle,
                "youtube": currentMeme.youtube,
                "url": currentMeme.url,
                "width": currentMeme.width
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