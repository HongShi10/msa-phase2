import * as React from "react";
import MediaStreamRecorder from 'msr';

import TextField from '@material-ui/core/TextField';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";

import Typography from '@material-ui/core/Typography';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';





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

interface IProps {
    songs: any[],
    selectedNewSong: any,
    searchByTag: any
}

export default class SongList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByTag = this.searchByTag.bind(this)
        this.postAudio = this.postAudio.bind(this)
        this.searchTagByVoice= this.searchTagByVoice.bind(this)
    }

	public render() {
		return (
			<div className="container song-list-wrapper">
                <div className="row song-list-heading">
                    <div className="input-group">
                        <div className="searchField">
                            <MuiThemeProvider theme={theme}>
                                <TextField id="search-tag-textbox" label="Search By Artist" type="text" className="form-control" margin="normal"/> 
                            </MuiThemeProvider>
                        </div>
                            <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByTag}>Search</div>
                            <div className="btn" onClick={this.searchTagByVoice}><i className="fa fa-microphone" /></div>

                        </div>
                    </div>  
                </div>
                <div className="row song-list-table">
                    <div className="table table-striped">
                        <div className="scrolling-wrapper">
                            {this.createTable()}
                        </div>
                    </div>
                </div>
            </div>
		);
    }
    public searchTagByVoice(){
        const mediaConstraints = {
            audio: true
        }
        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
    
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    public postAudio(blob :any){
        let accessToken: any;
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': '3cc7f79490cf472e967b2a6b8e50a4a7'
            },
            method: 'POST'
        }).then((response) => {
             console.log(response.text())
            return response.text()
        }).then((response) => {
            console.log(response)
            accessToken = response
        }).catch((error) => {
            console.log("Error", error)
        });
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US', {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': '3cc7f79490cf472e967b2a6b8e50a4a7'
            },    
            method: 'POST'
        }).then((res) => {
            return res.json()
        }).then((res: any) => {
            console.log(res)
            const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
            textBox.value = (res.DisplayText as string).slice(0, -1)
        }).catch((error) => {
            console.log("Error", error)
        });
    }

    
    // Construct table using song list
	private createTable() {

        const cardStyle = {
            transitionDuration: '0.3s',
            height:"140",
            maxWidth: '100%'

        }
    
        // const table:any[] = []
        const cardList: any[] = []
        const songList = this.props.songs
        if (songList == null) {
            return cardList
        }

        Object.keys(songList).forEach((cardIndex)=> {
            cardList.push (
                <Card className = "card" style={cardStyle}>
                <CardActionArea onClick={this.selectRow.bind(this,cardIndex)}>
                  <CardMedia>{<img className="albumArt" src={songList[cardIndex].url}/>}</CardMedia>
                  <CardContent>
                    <Typography gutterBottom={true} variant="h5">
                      {songList[cardIndex].title}
                    </Typography>
                    <Typography component="p">
                    {songList[cardIndex].tags}
                    </Typography>
                  </CardContent>
                </CardActionArea>        
              </Card>   
            )
        })
            return cardList

        }
        // return table
    
    // song selection handler to display selected song in details component
    private selectRow(index: any) {
        const selectedSong = this.props.songs[index]
        if (selectedSong != null) {
            this.props.selectedNewSong(selectedSong)
        }
    }

    // Search song by tag
    private searchByTag() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const tag = textBox.value 
        this.props.searchByTag(tag)  
    }

}

