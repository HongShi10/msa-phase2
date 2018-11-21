import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import MemeDetail from './components/MemeDetail';
import MemeList from './components/MemeList';
import PatrickLogo from './patrick-logo.png';

import Facebook from './components/Facebook';

interface IState {
	currentMeme: any,
	memes: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentMeme: {"id":0, "title":"Loading ","url":"","genre":"⚆ _ ⚆","youtube":"","width":"0","height":"0"},
			memes: [],
			open: false,
			uploadFileList: null
		}     
		
		this.fetchMemes("")
		this.selectNewMeme = this.selectNewMeme.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchMemes = this.fetchMemes.bind(this)
		this.uploadMeme = this.uploadMeme.bind(this)
		
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
				<div className="facebook-component"><Facebook/></div>
					<img src={PatrickLogo} height='40'/>&nbsp; Song Bank &nbsp;
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Add Song</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<MemeDetail currentMeme={this.state.currentMeme} />
						
					
					</div>
					<div className="col-5">
						<MemeList memes={this.state.memes} selectNewMeme={this.selectNewMeme} searchByTag={this.fetchMemes}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Song Title</label>
						<input type="text" className="form-control" id="meme-title-input" placeholder="Enter Song Title" />
					</div>
					<div className="form-group">
						<label>Artist</label>
						<input type="text" className="form-control" id="meme-tag-input" placeholder="Enter Artist" />
						<small className="form-text text-muted">Artist is used in search</small>
					</div>
					<div className="form-group">
						<label>Album Art</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="meme-image-input" />
						<small className="form-text text-muted">Add an album/song art</small>
					</div>
					<div className="form-group">
                            <label>Youtube Link</label>
                            <input type="text" className="form-control" id="youtube-tag-input" placeholder="Enter Youtube Link"/>
                        </div>

					<button type="button" className="btn" onClick={this.uploadMeme}>Upload</button>
				</form>
			</Modal>
		</div>
		);
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected meme
	private selectNewMeme(newMeme: any) {
		this.setState({
			currentMeme: newMeme
		})
	}

	// GET memes
	private fetchMemes(genre: any) {
		let url = "https://songapiphase2.azurewebsites.net/api/SongItems"
		if (genre !== "") {
			url += "/Genre?=" + genre
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			let currentMeme = json[0]
			if (currentMeme === undefined) {
				currentMeme = {"id":0, "title":"No memes (╯°□°）╯︵ ┻━┻","url":"","genre":"try a different tag","youtube":"","width":"0","height":"0"}
			}
			this.setState({
				currentMeme,
				memes: json
			})
        });
	}

	// Sets file list
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	// POST meme
	private uploadMeme() {
		const titleInput = document.getElementById("meme-title-input") as HTMLInputElement
		const tagInput = document.getElementById("meme-tag-input") as HTMLInputElement
		const youtubeInput = document.getElementById("youtube-tag-input") as HTMLInputElement

		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null || youtubeInput === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const youtube = youtubeInput.value
		const url = "https://songapiphase2.azurewebsites.net/api/SongItems/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("Artist", tag)
		formData.append("image", imageFile)
		formData.append("youtube", youtube)

		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
        .then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText)
			} else {
				location.reload()
			}
		  })
	}
}

export default App;
