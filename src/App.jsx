import React, { Component } from 'react';
import './App.css';
import { FormGroup, FormControl, InputGroup, Glyphicon, Button } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';

class App extends Component{
	constructor(props){
		super(props);

		this.state = {
			query: '',
			artist: null,
			tracks: [],
		}
	}

	search(){
		const BASE_URL = 'https://api.spotify.com/v1/search?';
		let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
		const ALBUM_URL = 'https://api.spotify.com/v1/artists';

		const accessToken = 'BQBCmhh1P5vfM9VFPhEgM1SKq4ybVqhdpA3fSSsaEodA0H5oMGh0cJ6o6ptJawIKikmd1R-WAmd7uME2XZntp01UWunBnLw6sRPyFn14OvpTtYJBis4NgAk0WOuWldsTFQ3qGV5sBXTLB96r_2meKGEC_O01izX8-Sz-EE5CeJfA7K7tfbu_pZ-TLt5JiAEw-GC_QNoRkkY97ECGvSRiJI6GamuJFLcqiFdbpBGADJkEUk2zWQ3xnhIngFLywl7P-3PSVEoOAFM0P-dpA5et';

		let headers = new Headers();
		let options = {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + accessToken
			},
			mode: 'cors',
			cache: 'default'
		};

		fetch(FETCH_URL, options)
			.then(response => response.json())
			.then(json => {
				console.log('Result: ',json);

				const artist = json.artists.items[0];

				console.log(artist);

				this.setState(
					{
						artist,
					}
				)

				FETCH_URL = `${ALBUM_URL}/${artist.id}/top-tracks?country=US`;

				fetch(FETCH_URL, {
					method: 'GET',
					headers: {
						'Authorization': 'Bearer ' + accessToken
					},
					mode: 'cors',
					cache: 'default'
				})
				.then(response=>response.json())
				.then(json=>{
					console.log('artist\'s top tracks', json);
					const { tracks } = json;
					this.setState({
						tracks
					});
				})
			});

		console.log('this.state: ', this.state);
		console.log('FETCH_URL: ', FETCH_URL);
	}

	render(){
		return (
			<div className="App">
				<div className="App-title">Music master from App</div>
				<FormGroup>
					<InputGroup>
						<FormControl
							placeholder="Search keyword here.."
							value={this.state.query}
							onChange={event => {this.setState({query: event.target.value}) } }
							onKeyPress={event => {
								if( event.key === 'Enter'){
									this.search();
								}
							}}
						/>
						<InputGroup.Addon
							onClick={()=>this.search()}
						>
							Search
							<Glyphicon glyph="search"></Glyphicon>
						</InputGroup.Addon>
					</InputGroup>
				</FormGroup>

				{
					this.state.artist !== null
					? <div>
						<Profile
							artist={this.state.artist}
						/>
						<Gallery tracks={this.state.tracks}/>
					</div>
					: <div></div>
				}
			</div>
		)
	}
}

export default App;