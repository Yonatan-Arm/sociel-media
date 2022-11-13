import React from "react";
import Preview from "./Preview";

export default function List({friends,onRemoveFriend,RemoveFriendFromList}) {
  return (
    <div className="list">
      {friends.map((friend) => {
        return <Preview friend={friend} key={friend._id} onRemoveFriend={onRemoveFriend} RemoveFriendFromList={RemoveFriendFromList} />
      })}
    </div>
  );
}
