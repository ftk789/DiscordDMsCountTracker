// ==UserScript==
// @name         Discord Unread Messages Tracker
// @namespace    http://ftk.li/
// @version      1.3
// @description  Track unread messages and send them to a local server on DOM change
// @match        https://discord.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/ftk789/DiscordDMsCountTracker/main/Discord%20Unread%20Messages%20Tracker.user.js
// @downloadURL  https://raw.githubusercontent.com/ftk789/DiscordDMsCountTracker/main/Discord%20Unread%20Messages%20Tracker.user.js
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    let unreadMessages = {};

    // You can change this functions logic according to your needs. In this case it sends to update endoint at that port
    function sendToServer(data) {
        try {
            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:3644/update",
                data: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json"
                },
                onload: function(response) {
                    console.log("Server response: ", response.responseText);
                },
                onerror: function(error) {
                    console.error("Error in sendToServer: ", error);
                }
            });
        } catch (error) {
            console.error("Critical error in sendToServer: ", error);
        }
    }

    function updateUnreadMessages() {
        try {
            let newUnreadMessages = {};
            document.querySelectorAll('div[role="treeitem"]').forEach(channel => {
                const dataListItemId = channel.getAttribute('data-list-item-id');
                if (dataListItemId && dataListItemId.startsWith('guildsnav___')) {
                    const pfpElem = channel.querySelector('img');
                    const usernameEl = channel.querySelector('span');
                    if (usernameEl) {
                        const username = usernameEl.innerHTML;
                        const pfp = pfpElem ? pfpElem.src : '';
                        if (username && username.includes("unread message")) {
                            const parts = username.split(",");
                            const rawUsername = parts[0].trim();
                            let count = 0;
                            if (parts.length > 1) {
                                const match = parts[1].match(/\d+/);
                                if (match) {
                                    count = parseInt(match[0], 10);
                                }
                            }

                            newUnreadMessages[username] = {
                                rawUsername,
                                pfp,
                                count
                            };
                        }
                    }
                    if (usernameEl) {
                        const username = usernameEl.innerHTML;
                        const pfp = pfpElem ? pfpElem.src : '';
                        if (username && username.includes("unread message")) {
                            const parts = username.split(",");
                            const rawUsername = parts[0].trim();
                            let count = 0;
                            if (parts.length > 1) {
                                const match = parts[1].match(/\d+/);
                                if (match) {
                                    count = parseInt(match[0], 10);
                                }
                            }

                            newUnreadMessages[username] = {
                                rawUsername,
                                pfp,
                                count
                            };
                        }
                    }

                }
            });

            // Only send if there's a difference from the last state
            const prevData = JSON.stringify(unreadMessages);
            const newData = JSON.stringify(newUnreadMessages);
            if (prevData !== newData) {
                unreadMessages = newUnreadMessages;
                GM_setValue("unreadData", unreadMessages);
                sendToServer(unreadMessages);
                console.log("New unread data sent to server.");
            }
        } catch (error) {
            console.error("Error in updateUnreadMessages: ", error);
        }
    }

    function observeNewMessages() {
        try {
            const observer = new MutationObserver(() => {
                updateUnreadMessages();
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } catch (error) {
            console.error("Error in observeNewMessages: ", error);
        }
    }

    observeNewMessages();
})();
