export const login=(userData)=>({
    type:'login',
    payload:userData,
    // console.log(userData),
})
export const logout=()=>({
    type:'logout',
})