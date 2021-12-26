import classes from "../styles/RoomCard.module.css";
import {Link} from "react-router-dom";

const RoomCard = ({houseId, roomId,...props}) => {
    return (
        <div {...props} className={classes.mainDiv}>
            <Link to={"/sensors/" + houseId +"/" + roomId}>Комната № {roomId}</Link>
        </div>
    );
};

export default RoomCard