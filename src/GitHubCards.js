import React from "react";
import './GitHubCards.css';
import axios from 'axios';


const testData = [
    {name: "Dan Abramov", avatar_url: "https://avatars0.githubusercontent.com/u/810438?v=4", company: "@facebook"},
    {name: "Sophie Alpert", avatar_url: "https://avatars2.githubusercontent.com/u/6820?v=4", company: "Humu"},
    {name: "Sebastian Markbåge", avatar_url: "https://avatars2.githubusercontent.com/u/63648?v=4", company: "Facebook"},
];

const CardList = (props) => (
    <div>
        {props.profiles.map(profile => <Card {...profile}/>)}
    </div>
);

class Form extends React.Component {
    state = {userName: ''};
    handleSubmit = async (event) => {
        event.preventDefault();
        const resp = await axios.get(`https://api.github.com/users/${this.state.userName}`);
        this.props.onSubmit(resp.data);
    };
    render() {
        return(
            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    value={this.state.userName}
                    onChange={event => this.setState({userName: event.target.value})}
                    placeholder="GitHub username"
                    required
                />
                <button>Add card</button>
            </form>
        );
    }
}

class Card extends React.Component {
    render() {
        const profile = this.props;
        return (
            <div className="github-profile">
                <img src={profile.avatar_url}/>
                <div className="info">
                    <div className="name">{profile.name}</div>
                    <div className="company">{profile.company}</div>
                </div>
            </div>
        );
    }
}

class Container extends React.Component {
    state = {
        profiles: testData
    };
    addNewProfile = (profileData) => {
        this.setState(prevState => ({profiles: [...prevState.profiles,profileData]}));
    };
    render() {
        return (
            <div>
                <Form onSubmit={this.addNewProfile}/>
                <CardList profiles={this.state.profiles}/>
            </div>
        );
    }
}

export default Container;