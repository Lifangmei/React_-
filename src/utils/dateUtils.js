/*
格式化日期的工具模块
*/

export function formateDate(time){
    if(!time) return ''
    let date = new Date(time)
    let hours = date.getHours()
    hours = (Math.floor(hours/10)===0?('0'+hours):hours)
    let minutes = date.getMinutes()
    minutes = (Math.floor(minutes/10)===0?('0'+minutes):minutes)
    let seconds = date.getSeconds()
    seconds = (Math.floor(seconds/10)===0?('0'+seconds):seconds)
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+hours
    +':'+minutes+':'+seconds
}