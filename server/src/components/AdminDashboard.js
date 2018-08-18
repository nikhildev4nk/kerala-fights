import  React,{ Component } from 'react'; 
import {NavLink,withRouter,Switch,Route} from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { showMessage, hideMessage } from './../redux/actions.js';   
import AppMessage from './AppMessage.js';
 
import Rescue from './Rescue';
import DetailsModal from './DetailsModal';
import RequestLister from './RequestLister';
import StatusWidget from './StatusWidget.js';
import FilterComponent from './FilterComponent';

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
            <NavLink  to="/manage/duplicates" 
                className="w3-button  w3-block w3-orange w3-margin-bottom">
                Check For duplicates
            </NavLink> 
            <StatusWidget/>
        </div>
    )
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
        if (msg =='reload'){
            this.fetchData(this.props);
        }
        this.setState({modal:null})
    }

    showDetailModal(item){
        const {status ='new'} = this.props.match.params;
        this.setState({
            modal:<DetailsModal
                item={item} 
                status={status}
                hideModal={this.hideModal.bind(this)}/>
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
    handleFilterData(filterData) {
        console.log('fileter data from common compo', filterData);
    }

    render () {
        let { page=1, status='dashboard' } = this.props.match.params;
        const {search} = this.state;
        let content = null;

        if (status == 'dashboard' ){
            content = <DaashboardInfo />
        } else {
            content = <RequestLister 
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
                <FilterComponent 
                    handleFilterData={this.handleFilterData.bind(this)}
                />
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
