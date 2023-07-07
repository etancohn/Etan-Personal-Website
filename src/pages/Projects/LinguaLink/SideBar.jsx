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
            <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
            <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                History
            </a>
            </CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
                <div className="ll-history-sidebar">
                    {history.slice().reverse().map((item, i) => (
                        LLHistoryItem(item, history.length - i - 1, history, setCurrentWord)
                    ))}
                </div>
            </CDBSidebarContent>

            <CDBSidebarFooter style={{ textAlign: 'center' }}>
            <div
                style={{
                padding: '20px 5px',
                }}
            >
                {/* Sidebar Footer */}
            </div>
            </CDBSidebarFooter>
        </CDBSidebar>
        </div>
    );
};

export default Sidebar;