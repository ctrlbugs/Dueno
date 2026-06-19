import React, { useCallback, useEffect, useMemo, useState } from "react";
import Select from "react-select";

export type Option = {
  value: string;
  label: string;
};

export interface SelectProps {
  options: Option[];
  defaultValue?: Option;
  value?: Option;
  onChange?: (option: Option | null) => void;
  className?: string;
  styles?: Record<string, unknown>;
  /** Render menu in document.body so it is not clipped by overflow containers */
  menuPortal?: boolean;
  maxMenuHeight?: number;
  /** Shrink menu height on smaller screens and enable scroll */
  responsiveMenuHeight?: boolean;
}

const getResponsiveMenuHeight = (cap: number) => {
  if (typeof window === "undefined") return cap;

  const viewportHeight = window.innerHeight;
  const minHeight = 148;
  const reservedSpace = 120;
  const available = viewportHeight - reservedSpace;

  return Math.floor(Math.max(minHeight, Math.min(cap, available * 0.55)));
};

const CommonSelect: React.FC<SelectProps> = ({
  options,
  defaultValue,
  value,
  onChange,
  className,
  styles: stylesProp,
  menuPortal = true,
  maxMenuHeight = 320,
  responsiveMenuHeight = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<Option | undefined>(
    value ?? defaultValue,
  );
  const [menuHeight, setMenuHeight] = useState(maxMenuHeight);

  const updateMenuHeight = useCallback(() => {
    setMenuHeight(
      responsiveMenuHeight
        ? getResponsiveMenuHeight(maxMenuHeight)
        : maxMenuHeight,
    );
  }, [maxMenuHeight, responsiveMenuHeight]);

  useEffect(() => {
    updateMenuHeight();
  }, [updateMenuHeight]);

  useEffect(() => {
    if (!responsiveMenuHeight) return;

    const onResize = () => updateMenuHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [responsiveMenuHeight, updateMenuHeight]);

  const customStyles = useMemo(
    () => ({
      menuPortal: (base: Record<string, unknown>) => ({
        ...base,
        zIndex: 9999,
      }),
      menu: (base: Record<string, unknown>) => ({
        ...base,
        borderRadius: 8,
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
      }),
      menuList: (base: Record<string, unknown>) => ({
        ...base,
        maxHeight: menuHeight,
        overflowY: "auto",
        paddingTop: 4,
        paddingBottom: 4,
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        scrollbarWidth: "thin",
      }),
      option: (
        base: Record<string, unknown>,
        state: { isSelected: boolean; isFocused: boolean },
      ) => ({
        ...base,
        color: "#5D6772",
        backgroundColor: state.isSelected ? "#ddd" : "white",
        cursor: "pointer",
        padding: "10px 12px",
        "&:hover": {
          backgroundColor: state.isFocused ? "#03BD9D" : "white",
          color: state.isFocused ? "#fff" : "#03BD9D",
        },
      }),
      ...stylesProp,
    }),
    [menuHeight, stylesProp],
  );

  const handleChange = (option: Option | null) => {
    setSelectedOption(option || undefined);
    onChange?.(option);
  };
  useEffect(() => {
    if (value !== undefined) {
      setSelectedOption(value || undefined);
      return;
    }
    setSelectedOption(defaultValue || undefined);
  }, [defaultValue, value]);
  
  return (
    <Select
      classNamePrefix="react-select"
      className={className}
      styles={customStyles}
      options={options}
      value={selectedOption}
      onChange={handleChange}
      placeholder="Select"
      maxMenuHeight={menuHeight}
      onMenuOpen={updateMenuHeight}
      menuPortalTarget={
        menuPortal && typeof document !== "undefined" ? document.body : undefined
      }
      menuPosition="fixed"
      menuShouldScrollIntoView
      menuPlacement="auto"
    />
  );
};

export default CommonSelect;
