import React from 'react';
import { Section } from './section';

import firebase from 'firebase/app';
import 'firebase/firestore';

import { firstNameLastNameValidator, emailValidator, textValidator } from '../interface/validator';

export interface FormData {
    title: 'semper' | 'blandit' | 'nibh',
    firstName: string,
    lastName: string,
    email: string,
    message: string,

}

export class FormDemo extends Section{

    constructor(props: any){
        super(props);
        this.state = {
            title: 'Nibh',
            firstName: '',
            lastName: '',
            email: '',
            message: '',
        }

        this.handleSubmit = this.handleSubmit.bind(this)
    }


    pcsRender(){};
    componentDidMount(){
    }

    handleSubmit(e: any) {
        
        e.preventDefault();

        firebase.firestore().collection("demoFormData").doc(Date.now().toString()).set(this.state)
                .then(function() {
                    // console.log("Document successfully written!");
                })
                .catch(function(error: any) {
                    // console.error("Error writing document: ", error);
                });
                



        this.setState({
            title: 'nibh',
            firstName: '',
            lastName: '',
            email: '',
            message: '',
        })
    }


    render() {

        return <div style = {this.style}>
                    <div className="jumbotron">
                        <h1 className="display-4">{this.state.title} {this.state.firstName.slice(0,10)} {this.state.lastName.slice(0,10)}</h1>
                        <p className="lead">{this.state.email.slice(0,20)}</p>
                        
                        <hr className="my-4"/>
                        <p>{this.state.message.slice(0,50)}</p>
                    </div>


                    <form style={{marginTop: "20px"}} onSubmit={this.handleSubmit}>

                        <div className="form-group">
                            <label htmlFor="title">Proin</label>
                            <select className="form-control" id="title" value={this.state.title} onChange={(e)=>{this.setState({title: e.target.value})}}>
                                <option value="Semper">Semper</option>
                                <option value="Blandit">Blandit</option>
                                <option value="Nibh">Nibh</option>
                            </select>
                            <small className="form-text text-muted">Curabitur nunc sapien, auctor vitae cursus a, ullamcorper ut dolor.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="firstName">Mauris</label>
                            <input type="text" className="form-control" id="firstName" placeholder="Etiam" value={this.state.firstName} onChange={(e)=>{this.setState({firstName: e.target.value})}}/>
                            <small className="form-text text-muted">Aenean facilisis mi dui.</small>
                            {this.state.firstName.match(firstNameLastNameValidator)?null:<small className="form-text text-danger">Nulla dictum ac ex vitae tempor.</small>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="lastName">Nulla</label>
                            <input type="text" className="form-control" id="lastName" placeholder="Curabitur"value={this.state.lastName} onChange={(e)=>{this.setState({lastName: e.target.value})}}/>
                            {this.state.lastName.match(firstNameLastNameValidator)?null:<small className="form-text text-danger">Cras sagittis massa nec nisi viverra, nec accumsan nisl scelerisque. </small>}
                            <small className="form-text text-muted">Sed elementum magna magna, non facilisis ipsum venenatis quis.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Suspendisse</label>
                            <input type="email" className="form-control" id="email" placeholder="Orci" value={this.state.email} onChange={(e)=>{this.setState({email: e.target.value})}}/>

                            {this.state.email.match(emailValidator)?null:<small className="form-text text-danger">Aliquam mattis felis vel ex vestibulum, id ultricies tellus auctor.</small>}
                            <small className="form-text text-muted">Maecenas id lorem massa.</small>
                        </div>

                        <div className="form-group">
                            <label htmlFor="textarea">Donec</label>
                            <textarea className="form-control" id="message" rows={3} placeholder="Proin feugiat vestibulum libero sit amet pellentesque"
                                value={this.state.message} onChange={(e)=>{this.setState({message: e.target.value})}}
                            ></textarea>
                            {this.state.message.match(textValidator)?null:<small className="form-text text-danger">Quisque varius enim id accumsan volutpat.</small>}
                            <small className="form-text text-muted">Sed lectus justo, aliquam ac lectus et, iaculis feugiat purus.</small>

                        </div>


                        <button id="submit" type="submit" className="btn btn-primary" disabled={
                                                                                                !this.state.firstName.match(firstNameLastNameValidator) ||
                                                                                                !this.state.lastName.match(firstNameLastNameValidator) ||
                                                                                                !this.state.email.match(emailValidator) ||
                                                                                                !this.state.message.match(textValidator)

                        }
                        
                        >Integer</button>

                    </form>

               </div>
    }
}