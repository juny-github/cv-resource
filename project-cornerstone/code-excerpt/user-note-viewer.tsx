import { Section } from "./section";
import moment from 'moment';
import firebase from "firebase/app";

import 'firebase/firebase-auth';

import React from "react";
import { textValidator, textLongValidator } from "../interface/validator";

export class UserNoteViewer extends Section {
    constructor(props){
    super(props);

    this.state = {totalData: undefined,
                  currentPageIndex: 0,
                  currentNoteId: undefined,
                  readOnly: undefined,
                  user: undefined,
                  titleBuffer: '',
                  contentBuffer: '',
                  isImportant: 'false',

                  
};
    this.updateTitleBuffer = this.updateTitleBuffer.bind(this);
    this.updateContentBuffer = this.updateContentBuffer.bind(this);
    this.updateIsImportant = this.updateIsImportant.bind(this);
    this.closeNoteEditor = this.closeNoteEditor.bind(this);
    this.submitNote = this.submitNote.bind(this);
    this.openNoteEditor = this.openNoteEditor.bind(this);

    this.style.backgroundColor = 'orange';
    this.isUserControlled = false;
    this.delay = 0;

    this.updateCurrentPageIndex = this.updateCurrentPageIndex.bind(this);


}

    private itemsPerPage = 5;
    private subscriptionRef;

    private cancelUserSubscription;

    

    componentDidMount(){
        super.componentDidMount()

        this.cancelUserSubscription=firebase.auth().onAuthStateChanged((user)=>{
            if(user){
                this.setState({user: user});
            }else{
                this.setState({user: undefined});

            }

        })
        
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        if (this.subscriptionRef){
        this.subscriptionRef();
        }

        if (this.cancelUserSubscription) {
            this.cancelUserSubscription();
        }
    }

    openNoteEditor(id, ifReadOnly,title,content,isImportant){
        this.setState({currentNoteId: id});
        this.setState({ifReadOnly: ifReadOnly});
        this.setState({titleBuffer: title});
        this.setState({contentBuffer: content});
        this.setState({isImportant: isImportant});

    }
    closeNoteEditor(){
        this.setState({currentNoteId: undefined});
        this.setState({titleBuffer: ''});
        this.setState({contentBuffer: ''});
        this.setState({isImportant: false});
        this.setState({readOnly: undefined});
        
        

    }

    updateTitleBuffer(e){
        
        this.setState({titleBuffer: e.target.value});
    }

    updateContentBuffer(e){

        this.setState({contentBuffer: e.target.value});
    }

    updateIsImportant(e) {

    }
    submitNote(){

        firebase.firestore().collection('/users').doc(firebase.auth().currentUser.uid).collection('/notes').doc(this.state.currentNoteId).set({
            id: this.state.currentNoteId,
            title: this.state.titleBuffer,
            content: this.state.contentBuffer
        })

        this.closeNoteEditor();

    }



    updateCurrentPageIndex(e){
        e.preventDefault();
        this.setState({currentPageIndex: Number(e.target.dataset.index)})

    }


    
    listenFromServer(){

        this.subscriptionRef = firebase.firestore().collection('/users').doc(firebase.auth().currentUser.uid).collection('/notes')
        //.limit(100)
        .onSnapshot((snapshot) => {

            this.setState({totalData: snapshot.docs.map((doc)=>doc.data()).reverse()})

        }, 
        
        (error)=>{
        }
        );

    }
    
    
    pcsRender(){
        if (!this.subscriptionRef && this.state.user) {
            this.listenFromServer();
        }

        let totalPageCount;

        
        if (this.state.totalData && this.state.totalData.length < this.itemsPerPage){
            totalPageCount = 1;
        }else if (this.state.totalData &&  this.state.totalData.length % this.itemsPerPage === 0)
            {
            totalPageCount = this.state.totalData.length/this.itemsPerPage;
            
        }else if(this.state.totalData)
            {
            totalPageCount = ((this.state.totalData.length - (this.state.totalData.length%this.itemsPerPage)) /this.itemsPerPage)+1;
            
            
        }else{
            totalPageCount = undefined;
        }

        let currentDataSlice; 
        if (this.state.totalData) {

            currentDataSlice = this.state.totalData.slice(this.state.currentPageIndex * this.itemsPerPage, (this.state.currentPageIndex * this.itemsPerPage)+this.itemsPerPage);

        }else{
            currentDataSlice = undefined;
        }


        let dataSlice;
        if(!currentDataSlice){
            
            dataSlice = <tr>
                            <th scope="row">Curabitur</th>
                            <td>Curabitur</td>
                            <td>Curabitur</td>
                            <td>Curabitur</td>

                        </tr>
        }else{

            dataSlice = currentDataSlice.map((data, index)=>{
                             return <tr key={index} >
                                        <th scope="row"><button className={data.isImportant?"btn btn-danger":"btn btn-outline-primary"} onClick={()=>{this.openNoteEditor(data.id,true,data.title,data.content,data.isImportant)}}>{data.title}</button></th>
                                        <td>{ moment(data.id).format("DD-MM-YYYY HH:mm:ss")}</td>
                                        <td>{data.content.slice(0,30)+"..."}</td>
                                    </tr>

                            }

            )            

        }



        let pageNavBtnGroup;

        if (!totalPageCount) {

            pageNavBtnGroup = <div>Curabitur</div>
        } else {
            pageNavBtnGroup = [];
            let i = 0;
            while (i<totalPageCount) {
                pageNavBtnGroup.push(

                    <li key={i} className="page-item">
                        <a className="page-link" href="#" data-index={i} onClick={this.updateCurrentPageIndex}>{i}</a>
                    </li>

                );
                i++;

            }
        }


        let editor;
        if (this.state.currentNoteId) {
            editor = (  
                        <div>
                                <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Orci</span>
                                </div>
                                <input className="form-control"  value={this.state.titleBuffer} onChange={this.updateTitleBuffer}/>
                                
                                </div>

                                {this.state.titleBuffer.match(textValidator)?null:<small id="emailHelp" className="form-text text-danger">Sed tempus, purus in pulvinar blandit.</small>}
                                <small id="emailHelp" className="form-text text-muted">Aliquam diam felis, semper in orci vitae, ornare accumsan lectus.</small>

                                <hr/>
                                
                                <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">Proin</span>
                                </div>
                                <textarea className="form-control"  value={this.state.contentBuffer} onChange={this.updateContentBuffer} rows={10}></textarea>
                                </div>
                                {this.state.contentBuffer.match(textLongValidator)?null:<small id="emailHelp" className="form-text text-danger">Donec eros dolor, ullamcorper a purus id, pulvinar fringilla ex.</small>}
                                <small id="emailHelp" className="form-text text-muted">Nunc at sagittis purus, vitae laoreet eros.</small>

                                <hr/>
                                 
                                 <div
                                    style ={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-around",
                                        alignItems: "center",
                                    }}
                                  >
                                    <button type="button" className="btn btn-danger" onClick={this.closeNoteEditor}>Cras</button>
                                    <button type="button" className="btn btn-primary" onClick={this.submitNote} disabled = {
                                                                                                                            !this.state.titleBuffer.match(textValidator) ||
                                                                                                                            !this.state.contentBuffer.match(textLongValidator)


                                    }
                                    >Curabitur</button>

                                </div>


                        </div>
            
          )

        }


        let content;
        if (this.state.user) {
                    content = <div style={this.state}>

                                <table className="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">Phasellus</th>
                                        <th scope="col">Fusce</th>
                                        <th scope="col">Vestibulum</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {dataSlice}

                                    </tbody>
                                </table>



                                <nav aria-label="Page navigation example">
                                    <ul className="pagination">
                                        {pageNavBtnGroup}
                                    </ul>
                                </nav>
                                
                                <hr/>
                                <button type="button" className="btn btn-success" onClick={()=>{this.openNoteEditor(new Date().toString(),false,'','',false)}}>Pellentesque</button>
                                
                                <hr/>
                                {editor}


                            </div>

        }else{
            content = null

        }

        return <div>{content}</div>
    }

}