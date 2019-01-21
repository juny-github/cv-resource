import React from 'react'
import { Section } from './section';


export class GoogleMap extends Section{

    constructor(props){
        super(props);
        this.style.backgroundColor = 'white';
        this.state = {
            loadingStatus: 'uninitialized',
        }
        this.isUserControlled = false;
    }
    map=undefined;
    abort = undefined;
    checking = undefined;

    componentDidMount() {
        super.componentDidMount();
    }
    componentWillUnmount(){
        if (this.abort){
            clearTimeout(this.abort);
        }
        if (this.checking){
            clearInterval(this.checking);
        }
    }

    initMap() {
        //check if google map loaded
        this.abort = setTimeout(()=>{
            if (!this.map) {
                clearInterval(this.checking);
                this.setState({loadingStatus: 'initializationTimeout'});
            }

        },5000);

        this.checking = setInterval(()=>{
       
                if(window.google){
                    
                    
                    this.map = new google.maps.Map(document.getElementById('map'), {
                        center: {lat: -34.397, lng: 150.644},
                        zoom: 8
                        })
                        
                        clearTimeout(this.abort);
                        clearInterval(this.checking);
                        this.setState({loadingStatus: 'initialized'});

                }else{
                        this.setState({loadingStatus: 'initializing'});

            }},100);


    }



    pcsRender() {
        if (this.state.loadingStatus === 'uninitialized'){
            this.initMap();
        }

        let status;
        if (this.state.loadingStatus === 'initializing'){
         status =  <div className="alert alert-info" role="alert">
                        Initializing
                   </div>

        }
        if (this.state.loadingStatus === 'initialized'){
            status =  <div className="alert alert-success" role="alert">
                            Initialized
                     </div>
        }
        if (this.state.loadingStatus === 'initializationTimeout'){
            status =  <div className="alert alert-danger" role="alert">
                            Initialization Timeout
                      </div>

        }

        return      <div style={{display: "flex", 
                                 flexDirection: "column", 
                                 flexWrap:"wrap",
                                 justifyContent:"center",
                                 alignItems:"center",
                                 height:'100%'
                                 }}>
                        {status}
                        <div id="map" style={{height:"600px", width:"100%"}}></div>
                    </div>

    }
}