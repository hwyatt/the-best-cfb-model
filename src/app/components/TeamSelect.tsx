import { useState, useEffect, useId } from "react";
import Select, { components } from "react-select";
import { GiAmericanFootballHelmet } from "react-icons/gi";
import { teamStadiumImages } from "../teams";

const Option = (props: any) => (
  <components.Option {...props}>
    <div className="flex gap-2">
      <img src={props.data.icon} alt="logo" className="w-6 h-auto" />
      {props.data.label}
    </div>
  </components.Option>
);

const SingleValue = (props: any) => (
  <components.SingleValue {...props}>
    <div className="flex gap-2">
      <img src={props.data.icon} alt="logo" className="w-6 h-auto" />
      {props.data.label}
    </div>
  </components.SingleValue>
);

export default function TeamSelect({ teams, selectedTeam, handleSelect }: any) {
  const options = teams.map((team: any) => ({
    value: team.school,
    label: team.school,
    icon: team?.logos?.[0] || null,
  }));

  return (
    <Select
      value={options.find(
        (option: any) => option.value === (selectedTeam && selectedTeam.school)
      )}
      onChange={handleSelect}
      options={options}
      instanceId={useId()}
      className="z-30"
      components={{
        Option: Option,
        SingleValue: SingleValue,
      }}
    />
  );
}
