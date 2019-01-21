import React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore'

import { Section } from "./section";



export class Pagination extends Section {
    constructor(props){
        super(props);
        this.state = {totalData: undefined,
                      currentPageIndex: this.props.currentPageIndex
        };
        this.style.backgroundColor = 'orange';
        this.isUserControlled = true;
        this.delay = 1000;

        this.updateCurrentPageIndex = this.updateCurrentPageIndex.bind(this);

        
    }
    
    private itemsPerPage = 5;
    private subscriptionRef;


    componentDidMount(){
        super.componentDidMount()
    }

    componentWillUnmount(){
        super.componentWillUnmount();
        if (this.subscriptionRef){
        this.subscriptionRef();
        }
    }



    updateCurrentPageIndex(e){
        e.preventDefault();
        this.props.updateCurrentPageIndex(Number(e.target.dataset.index));

    }

    listenFromServer(){

        this.subscriptionRef = firebase.firestore().collection('demoFormData')
        //.limit(100)
        .onSnapshot((snapshot) => {
            this.setState({totalData: snapshot.docs.map((doc)=>doc.data()).reverse()})
        }, 
        
        (error)=>{
        }
        );

    }

    pcsRender(){
        if (!this.subscriptionRef) {
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
            currentDataSlice = this.state.totalData.slice(this.props.currentPageIndex * this.itemsPerPage, (this.props.currentPageIndex * this.itemsPerPage)+this.itemsPerPage);

        }else{
            currentDataSlice = undefined;
        }

        

        let dataSlice;
        if(!currentDataSlice){
            
            dataSlice = <tr>
                            <th scope="row">Vestibulum</th>
                            <td>Vestibulum</td>
                            <td>Vestibulum</td>
                            <td>Vestibulum</td>
                            <td>Vestibulum</td>
                        </tr>
        }else{

            dataSlice = currentDataSlice.map((data, index)=>{
                             return <tr key={index}>
                                        <th scope="row">{data.title}</th>
                                        <td>{data.firstName}</td>
                                        <td>{data.lastName}</td>
                                        <td>{data.email}</td>
                                        <td>{data.message}</td>
                                    </tr>

                            }

            )            

        }



        let pageNavBtnGroup;

        if (!totalPageCount) {

            pageNavBtnGroup = <div>Vestibulum</div>
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

        return (

                <div style={this.state}>

                    <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Curabitur</th>
                            <th scope="col">Interdum</th>
                            <th scope="col">Sed</th>
                            <th scope="col">Maecenas</th>
                            <th scope="col">Mauris</th>
                            </tr>
                        </thead>
                        <tbody>

                            {dataSlice}

                        </tbody>
                    </table>



                    <nav>
                        <ul className="pagination">
                            {pageNavBtnGroup}
                        </ul>
                    </nav>


                </div>
                    

            )
    }

}