import {createAction, handleActions } from "redux-actions";
import {produce} from "immer";
import "moment";
import moment from "moment";
import axios from "axios";
import {history} from "../configureStore"
import { getCookie } from "../../share/Cookie";

const SET_ADS = "SET_ADS";
const DELETE = "DELETE";
const ADD_ADS = "ADD_ADS";
const EDIT_ADS = "EDIT_ADS"

const setAds = createAction(SET_ADS, (ads_list)=> ({ads_list}));
const addAds = createAction(ADD_ADS, (ads_list)=> ({ads_list}));
const editAds = createAction(EDIT_ADS, (ads_list, id)=> ({ads_list, id}));
const deleteAds = createAction(DELETE, (id) => ({id}));

const setAdsDB = ()=> {    //게시글들 불러오는 액션함수
    return function(dispatch){
        const axios = require("axios");
        axios.get("http://15.165.18.118/ads").then(function(response){
            dispatch(setAds(response.data))
        }).catch(function(error) {
            console.log(error);
        })
    }
}

const addAdsDB = (inputs) => {   //게시글 추가하는함수
    return function(dispatch, getState, {history}){
        const id = getState(state => state);
        const axios = require("axios");
        const headers = { authorization: `Bearer ${getCookie('session')}`}
        axios.post("http://15.165.18.118/ads",
        {  
            category: inputs.category,
            content: inputs.content,
            maxPeople: inputs.people,
            // createdAt: moment().format("YYYY-MM-DD hh:mm:ss"),
            host: id.user.nickname,
            title: inputs.title,
            UsersInAd:[{
                nickname: id.user.nickname,
            }]}, {headers: headers}).then(function(response){
            dispatch(addAds(inputs))
            history.push("/")
        }).catch(function(error) {
            console.log(error);
        })
    }
}
const editAdsDB = (inputs) => {   //게시글 수정하는함수
    return function(dispatch, getState){
        const axios = require("axios");
        const nickname = getState(state => state.user.nickname)
        const headers = { authorization: `Bearer ${getCookie('session')}`}
        axios.put(`http://15.165.18.118/ads/${inputs.id}`,   //id는 현재 들어가있는 게시글의 id
        {   
            category: inputs.category,
            content: inputs.content,
            maxPeople: inputs.people,
            host: nickname.user.nickname,
            createdAt: moment().format("YYYY-MM-DDThh:mm:ss.000z"),
            title: inputs.title}, {headers: headers}).then(function(response){
                dispatch(editAds(response, inputs.id))
                history.push("/");
            }).catch(function(error) {
                console.log(error);
            })
    }
}
const deleteAdsDB = (id) => {
    return function(dispatch){
        const axios = require("axios");
        const headers = { authorization: `Bearer ${getCookie('session')}`}
        axios.delete(`http://15.165.18.118/ads/${id}`, {headers: headers}).then(function(response){
            dispatch(deleteAds(response))
            history.push("/");
        }).catch(function(error) {
            console.log(error);
        })
    }
}


const setOneAdDB = (id) => {
    return function(dispatch, getState) {
        const axios = require('axios');
        const headers = { authorization: `Bearer ${getCookie('session')}`}
        axios.get("http://15.165.18.118/ads", {headers: headers}).then(function(response){
            dispatch(setAds(response.data));
        }).catch(function(error) {
            console.log(error);
        })
    }
}

const initialState = {
    list: [],
}

export default handleActions(
    {
        [SET_ADS]: (state, action) => produce(state, (draft) => {
            draft.list = [...action.payload.ads_list];     //게시글 데이터를 전부 불러서 배열에 등록
        }),
        [ADD_ADS]: (state, action) => produce(state, (draft)=> {   
             //추가된 게시글 데이터 배열에 추가
             let c = action.payload.ads_list
             let ads_add = {
                category: c.category,
                content: c.content,
                maxPeople: c.people,
                createdAt: moment().format("YYYY-MM-DDThh:mm:ss.000z"),
                title: c.title,
                UsersInAd: [],
             }
              draft.list.push(ads_add);
        }),
        [EDIT_ADS]: (state, action) => produce(state, (draft)=> { 
            // console.log(state);
            // draft.list[action.payload.ads_list.id] =  action.payload.ads_list.data;
        }),
        [DELETE]: (state, action) => produce(state, (draft) => {

        }),
    },
    initialState
);

const actionCreators = {
    setAds,
    addAds,
    addAdsDB,
    setAdsDB,
    editAdsDB,
    editAds,
    setOneAdDB,
    deleteAds,
    deleteAdsDB,
}

export { actionCreators };

