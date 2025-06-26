import React, { createContext, useContext, useState, useEffect } from "react";

export type DataSourceType = "api" | "mock";

interface DataSourceContextType {
  dataSource: DataSourceType;
  setDataSource: (source: DataSourceType) => void;
  isApiMode: boolean;
  isMockMode: boolean;
  toggleDataSource: () => void;
}

const DataSourceContext = createContext<DataSourceContextType | undefined>(
  undefined,
);

const DATA_SOURCE_STORAGE_KEY = "cyberguard_data_source";

export function DataSourceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [dataSource, setDataSourceState] = useState<DataSourceType>(() => {
    // 从localStorage读取用户之前的选择，默认为api模式以测试新接口
    const saved = localStorage.getItem(DATA_SOURCE_STORAGE_KEY);
    return (saved as DataSourceType) || "api";
  });

  const setDataSource = (source: DataSourceType) => {
    setDataSourceState(source);
    localStorage.setItem(DATA_SOURCE_STORAGE_KEY, source);
  };

  const toggleDataSource = () => {
    const newSource = dataSource === "api" ? "mock" : "api";
    setDataSource(newSource);
  };

  const isApiMode = dataSource === "api";
  const isMockMode = dataSource === "mock";

  return (
    <DataSourceContext.Provider
      value={{
        dataSource,
        setDataSource,
        isApiMode,
        isMockMode,
        toggleDataSource,
      }}
    >
      {children}
    </DataSourceContext.Provider>
  );
}

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (context === undefined) {
    throw new Error("useDataSource must be used within a DataSourceProvider");
  }
  return context;
}

export default DataSourceProvider;
