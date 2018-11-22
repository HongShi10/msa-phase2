import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import SongDetail from './components/SongDetail';
import SongList from './components/SongList';
import songBankLogo from './songbankLogo.png';

import Facebook from './components/Facebook';

interface IState {
	currentSong: any,
	songs: any[],
	open: boolean,
	uploadFileList: any,
	isLoggedIn: boolean
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentSong: {"id":0, "title":"Loading ","url":"","tags":"","youtube":"","width":"0","height":"0"},
			songs: [],
			open: false,
			uploadFileList: null,
			isLoggedIn: false,
		}     
		
		this.fetchSongs("")
		this.selectnewSong = this.selectnewSong.bind(this)
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.fetchSongs = this.fetchSongs.bind(this)
		this.uploadSong = this.uploadSong.bind(this)
		
	}
	public facebookAuthenticator = (response: any) =>{
		console.log(response.userID)
		if(response.userID === "2820542861305358"){
		this.setState({
			isLoggedIn: true
		})
	}
	}

	public render() {
		const { open } = this.state;
		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
				<span className="facebookLogin"><Facebook callback={this.facebookAuthenticator}/></span>
					<img src={songBankLogo} height='100'/>&nbsp;  &nbsp;
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<SongDetail currentSong={this.state.currentSong} authenticated={this.state.isLoggedIn} />
					</div>
					<div className="addButton">
					<div className="btn btn-add" onClick={this.onOpenModal}>Add Song</div>
					</div>
					<div className="col-5">
					
						<SongList songs={this.state.songs} selectedNewSong={this.selectnewSong} searchByTag={this.fetchSongs}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Song Title</label>
						<input type="text" className="form-control" id="song-title-input" placeholder="Enter Song Title" />
					</div>
					<div className="form-group">
						<label>Artist</label>
						<input type="text" className="form-control" id="song-tag-input" placeholder="Enter Artist" />
						<small className="form-text text-muted">Artist is used in search</small>
					</div>
					<div className="form-group">
						<label>Album Art</label>
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="song-image-input" />
						<small className="form-text text-muted">Add an album/song art</small>
					</div>
					<div className="form-group">
                            <label>Youtube Link</label>
                            <input type="text" className="form-control" id="youtube-tag-input" placeholder="Enter Youtube Link"/>
                        </div>

					<button type="button" className="btn" onClick={this.uploadSong}>Upload</button>
				</form>
			</Modal>

				<div className="footer"> <b>{this.state.currentSong.title}</b>   <span className="byText">  by  {this.state.currentSong.tags}</span> </div>
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
	private selectnewSong(newSong: any) {
		this.setState({
			currentSong: newSong
		})
	}

	// GET memes
	private fetchSongs(tags: any) {
		let url = "https://msaphase2webapp.azurewebsites.net/api/SongItems"
		if (tags !== "") {
			url += "/tag?=" + tags
		}
        fetch(url, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(json => {
			const currentSong = {"id":0, "title":"No Song Selected","url":"","tags":"Unknown","youtube":"","width":"0","height":"0"}
			this.setState({
				currentSong,
				songs: json
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
	private uploadSong() {
		const titleInput = document.getElementById("song-title-input") as HTMLInputElement
		const tagInput = document.getElementById("song-tag-input") as HTMLInputElement
		const youtubeInput = document.getElementById("youtube-tag-input") as HTMLInputElement

		const imageFile = this.state.uploadFileList[0]

		if (titleInput === null || tagInput === null || imageFile === null || youtubeInput === null) {
			return;
		}

		const title = titleInput.value
		const tag = tagInput.value
		const youtube = youtubeInput.value
		
		const url = "https://msaphase2webapp.azurewebsites.net/api/SongItems/upload"

		const formData = new FormData()
		formData.append("Title", title)
		formData.append("tags", tag)
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
