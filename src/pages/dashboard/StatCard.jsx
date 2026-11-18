
function StatCard ({label,value}){
    return (
        <div className="card">
            <div className="satr-value">{value}</div>
            <div className="muted-text">{label}</div>
        </div>
    );   

}

export default StatCard;