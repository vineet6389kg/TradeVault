import React from "react";

const Avatar = ({ user, size = 36 }) => {
  // first letters of the name, like "Aarav Kumar" becomes "AK"
  const initials = user.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const style = { width: size, height: size, fontSize: size * 0.38 };

  // alt is empty because the name is always written next to the avatar
  return user.avatar ? (
    <img
      src={user.avatar}
      alt=""
      style={style}
      className="shrink-0 rounded-full object-cover"
    />
  ) : (
    <span
      style={style}
      className="grid shrink-0 place-items-center rounded-full bg-primary font-bold text-primary-fg"
    >
      {initials}
    </span>
  );
};

export default Avatar;