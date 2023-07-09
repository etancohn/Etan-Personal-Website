import './SideBar.css'

import React from 'react';
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
} from 'cdbreact';

function LLHistoryItem (item, i, history, setCurrentWord) {
    return (
        <div className="ll-history-item" key={i}>
            <div className="square-container">
                <div className={`square square-${i % 5}`}></div>
            </div>
            <div className="ll-history-item-container">
                <span onClick={() => setCurrentWord(history[i])}><div className="ll-history-item-text">{item.word}</div></span>
            </div>
        </div>
    )
}

const Sidebar = ( {history=[], setCurrentWord} ) => {

    return (
        <div className="ll-sidebar">
        <CDBSidebar>
            <CDBSidebarHeader className="ll-sidebar-header" prefix={<i className="fa fa-bars fa-large"></i>}>
                <div href="/" className="text-decoration-none ll-history-title" style={{ color: 'inherit' }}>
                    HISTORY
                </div>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
                <div className="ll-history-sidebar">
                    {history.slice().reverse().map((item, i) => (
                        LLHistoryItem(item, history.length - i - 1, history, setCurrentWord)
                    ))}
                </div>
            </CDBSidebarContent>
            
        </CDBSidebar>
        </div>
    );
};

export default Sidebar;