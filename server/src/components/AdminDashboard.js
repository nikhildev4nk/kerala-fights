import  React,{ Component } from 'react'; 
import {NavLink,withRouter} from 'react-router-dom';
import { connect } from 'react-redux'; 
import { showMessage, hideMessage } from './../redux/actions.js';   
import AppMessage from './AppMessage.js';
import {Reveal} from './Helper';
import Rescue from './Rescue';
import DetailsModal from './DetailsModal';
import RequestLister from './RequestLister';
import StatusWidget from './StatusWidget.js';
import axios  from 'axios';
const DaashboardInfo =() => {
    return (
        <div className="w3-container" style={{minHeight:"100vh", paddingBottom: "100px"}}>
            <h3>What to do </h3>
            <ul className="w3-ul">
                <li><h4>The Workflow</h4>
                    <ul className="w3-ul">
                        <ol>1.Check - for data correctness / Duplicates</ol>
                        <ol>2.Call and Confirm - The person might sill need help, Call and Confirm the same.  </ol>
                        <ol>3.Retry - If you are not able to reach on previous step, update status so that you can retry</ol>
                        <ol>4.Need Help - The Verified requests that need help which you understood after the call.</ol>
                        <ol>5.Escalated - The items that need urgent attention, we will co-ordinate with rescue teams and field volunteers to help this list</ol>
                        <ol>6.Resolved - Shows the resolved issues</ol>
                    </ul>
                </li>
            
                <li>There are lot duplicates, see if the requester have added duplicates. you can do this by copying the phone number and searching on the searchbox above. Look at the list of requests and see if they are same, keep the one with maximum information and mark the rest of them as duplicates, as phone number is available there.</li>
                <li>If you see data is duplicated, mark it as duplicate and resolve the issue.</li>
                <li>Mark the duplicates - and that way we will be able understand problem in hand.</li>
                <li>In the search box help you search with / Name / Phone Number / District - First Letter Caps/ </li>
            </ul>
            <div className="w3-row-padding">
                <div className="w3-col s12 l6"><NavLink  to="/manage/duplicates" 
                className="w3-button  w3-block w3-blue w3-margin-bottom">
                Check For duplicates
            </NavLink> </div>
                <div  className="w3-col s12 l6"><NavLink  to="/manage/one_item/new" 
                className="w3-button  w3-block w3-green w3-margin-bottom">
                Takeup a Help request and start working on it
            </NavLink> </div>
            </div>
            
            
            <StatusWidget/>
        </div>
    )
}
 
class OneAtATime extends Component {
    constructor(arg){
        super(arg);
        this.state = {
            data:null
        }
    }
    fetchData(){
        this.setState({data:null});
        const {status='new'} = this.props;
        axios.get(`/api/v1/rescue-list?status=${status}&per_page=1`).then(resp=>{
            this.setState({
                data:resp.data.data
            });
        });
    }
    
    componentDidMount(){
        this.fetchData(this.props);
    }
    render(){
        return <div  style={{marginTop:"20px"}}>
            {this.state.data ? this.state.data.list.map(item => 
                <DetailsModal  
                authUser={this.props.authUser}
                hideModal={this.fetchData.bind(this)} item={item} />) : null }
        </div>
    }
}
class AdminDashboard extends Component{

    constructor(arg) {
        super(arg);
        this.state =   {
            data:null,
            search:'',
            mobileMenu:'w3-hide',
            modal:null,
            form: {},
            errors: {}, 
            successMessage: ''
        } 
    }
    hideModal(msg){
        this.setState({modal:null})
    }

    showDetailModal(item){
        const {status ='new'} = this.props.match.params;
        this.setState({
            modal:<Reveal  onClose={this.hideModal.bind(this)} >
                <DetailsModal  authUser={this.props.authUser} 
                hideModal={this.hideModal.bind(this)} 
                 item={item}  status={status}  />
            </Reveal>
        });
    }
    newRequest(){
        this.setState({modal:<Rescue hideModal={this.hideModal.bind(this)} />})
    }
    searchRequests(e){
        this.props.history.replace('/manage/search/'+e.target.value)
    }
    togggleMobile(){
        this.setState({mobileMenu:(this.state.mobileMenu == 'w3-hide')? 'w3-show' : 'w3-hide'})
    }
    render () {
        let { page=1, status='dashboard' } = this.props.match.params;
        const {search} = this.state;
        let content = null;
        
        if (status == 'dashboard' ){
            content = <DaashboardInfo />
        } else if (status == 'one_item'){
            content = <OneAtATime status={page} authUser={this.props.authUser}/> 
        } else {
            content = <RequestLister 
                    authUser={this.props.authUser}
                    page={page} 
                    status={status}  
                    showMessage={this.props.showMessage}
                    showDetailModal={this.showDetailModal.bind(this)} /> 
        }
        return (
            <div>
                <AppMessage />
                <div className="w3-bar w3-teal w3-top kf-top-bar">
                    <div className="w3-left">
                        <NavLink to="/manage/dashboard" exact className="w3-bar-item w3-small w3-button">
                            Admin Dashoard
                        </NavLink>
                        <button className="w3-bar-item w3-button w3-small w3-green" onClick={this.newRequest.bind(this)}>New <span className="w3-hide-small">Request</span></button>
                        <NavLink to="/heatmap" exact className="w3-bar-item w3-purple w3-small w3-button">
                            HeatMap
                        </NavLink>
                        <input className="w3-input w3-small w3-bar-item" onChange={this.searchRequests.bind(this)} placeholder="Name / Phone number" /> 
                    </div>
                    <div className="w3-right ">
                        <button className="w3-bar-item w3-small w3-sand  w3-button  w3-hide-large w3-hide-medium"  onClick={this.togggleMobile.bind(this)}>&#9776;</button>
                            {this.props.statusList.map(item=>{
                                return <NavLink key={item.key}
                                activeClassName="active" 
                                className={`w3-bar-item w3-button w3-hide-small w3-small ${item.cls}`}
                                to={`/manage/${item.key}`}>
                                    {item.title}
                            </NavLink>
                        })} 
                    </div>
                    <div className={`w3-bar-block  w3-hide-large w3-hide-medium ${this.state.mobileMenu}`}>
                        {this.props.statusList.map(item=>{
                            return <NavLink key={item.key}
                            activeClassName="active" 
                            className={`w3-bar-item w3-button w3-small ${item.cls}`}
                            to={`/manage/${item.key}`}>
                                {item.title}
                        </NavLink>
                        })} 
                    </div>
                </div>
                {this.state.modal}
                {content}
            </div>
        )
    }
} 


function mapStateToProps(state) {
    return {
        authUser: state.authUser,
        statusList:state.statusList,
        districtMap:state.districtMap
    }
}
export default withRouter(connect(mapStateToProps, { 
    showMessage,
    hideMessage
})(AdminDashboard));
