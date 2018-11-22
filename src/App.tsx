import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import SongDetail from './components/SongDetail';
import SongList from './components/SongList';
import songBankLogo from './songbankLogo.png';

import Facebook from './components/Facebook';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';


// all available props
const theme = {
  background: '#E5E5E5',
  fontFamily: 'Helvetica Neue',
  headerBgColor: '#ff4e4e',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#ff4e4e',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

const steps = [
	{
		id: '1',
		message: 'Welcome to Youtube Song Bank',
		trigger: '15'
	},
	{
		id: '15',
		component: (
			<img src={songBankLogo}/>
		  ),		trigger: '2'
	},
	{
		id: '2',
		message: 'What can I help you with?',
		trigger: '3'
	},
	{
		id: '3',
		options: [
		{ value: 1, label: 'Get Started', trigger: '9' },
		{ value: 2, label: 'Author Information', trigger: '4' },
		{ value: 3, label: 'Bug Report', trigger: '5' },
		],
	},
	{
		id: '4',
		message: 'Author Name: Hong Shi, Contact Info: Coecere@gmail.com',
		trigger: '6'
	},
	{
		id: '5',
		message: 'To report a bug please email Coecere@gmail.com',
		trigger: '6'
	},
	{
		id: '6',
		message: 'Do you need help with anything else?',
		trigger: '7'
	},
	{
		id: '7',
		options: [
		{ value: 1, label: 'Yes', trigger: '2' },
		{ value: 2, label: 'No', trigger: '8' },
		],
	},
	{
		id: '8',
		message: 'Thank You',
		end: true,
	},
	{
		id: '9',
		message: 'What do you want to get started with',
		trigger: '10',
	},
	{
		id: '10',
		options: [
		{ value: 1, label: 'Adding Songs', trigger: '12' },
		{ value: 2, label: 'Editing and Deleting', trigger: '11' },
		{ value: 3, label: 'Logging In', trigger: '15' },
		{ value: 4, label: 'Facebook/Youtube Integration', trigger: '13' },

		],
	},
	{
		id: '11',
		message: 'To edit or delete content you must be a authenticated by facebook as a admin of the website',
		trigger: '6',
	},
	{
		id: '12',
		message: 'To Add a song press, the button in the top right corner and fill out all the necessary fields including a valid youtube URL and album art',
		trigger: '6',
	},
	{
		id: '13',
		message: 'To login using facebook click the login button on the top left hand side or just log into facebook from the facebook website',
		trigger: '6',
	},
	{
		id: '14',
		message: 'To go to the youtube URL click the youtube icon on the bottom and to share to facebook click the facebook icon',
		trigger: '6',
	},

];


interface IState {
	currentSong: any,
	songs: any[],
	openAdd: boolean,
	openBot: boolean,
	uploadFileList: any,
	isLoggedIn: boolean
}


class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentSong: {"id":0, "title":"Loading ","url":"","tags":"","youtube":"","width":"0","height":"0"},
			songs: [],
			openAdd: false,
			openBot: false,
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
		const { openAdd } = this.state;
		const { openBot } = this.state;

		return (
		<div>
			<div className="header-wrapper">
				<div className="container header">
				<span className="facebookLogin"><Facebook callback={this.facebookAuthenticator}/></span>
					<img src={songBankLogo} height='100'/>&nbsp;  &nbsp;
				</div>
			</div>
			<div className="songTitle"><b>{this.state.currentSong.title}</b>   
				<span className="byText">  by  {this.state.currentSong.tags}</span></div>
			<div className="container">
				<div className="row">
					<div className="col-7 ">
						<SongDetail currentSong={this.state.currentSong} authenticated={this.state.isLoggedIn} />
					</div>
					<div className="col-5 split right">
						<SongList songs={this.state.songs} selectedNewSong={this.selectnewSong} searchByTag={this.fetchSongs}/>
					<div className="addButton">
					<div className="btn btn-add" onClick={this.onOpenAdd}>Add Song</div>
					</div>
					</div>
					
				</div>
			</div>
			<Modal open={openAdd} onClose={this.onCloseAdd}>
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
				<div className="chatBot">
				<Modal open={openBot} onClose={this.onCloseBot}>
				<div>
					<ThemeProvider theme={theme}>
						<ChatBot   speechSynthesis={{ enable: true, lang: 'en' }}
 							botDelay = '2000' steps={steps} />
					</ThemeProvider>	
					</div>
				</Modal>
				</div>
				<div className="footer right split"><button className="btn chatBotButton" onClick={this.onOpenBot}>Help</button></div>

		</div>
		);
	}

	// Opens botModal
	private onOpenBot = () => {
		this.setState({ openBot: true });
	  };
	
	// closes botModal
	private onCloseBot = () => {
		this.setState({ openBot: false });
	};

	// Modal open
	private onOpenAdd = () => {
		this.setState({ openAdd: true });
	  };
	
	// Modal close
	private onCloseAdd = () => {
		this.setState({ openAdd: false });
	};
	
	// Change selected song
	private selectnewSong(newSong: any) {
		this.setState({
			currentSong: newSong
		})
	}
	

	// GET Songs
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
		let imageFile;
		if(this.state.uploadFileList === null){
			 imageFile = "./songbankLogo.png"
		}
		else{
			 imageFile = this.state.uploadFileList[0]
		}

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
