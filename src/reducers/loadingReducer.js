const initialState={
    loading: false,
};

const loadingReducer=(state=initialState, action)=>{
    switch(action.type){
        case 'showLoading':
            return{
                ...state,
                loading: true,
            };
        case 'hideLoading':
            return{
                ...state,
                loading: false,
            };
            default:
                return state;
    };

};
export default loadingReducer;