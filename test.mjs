// This grabs all of the items in 


import mysql from "mysql";
import fetch from 'node-fetch';

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "dealfinder" // DEAL FINDER
});

function getItems(callback) {
    var list = [];
    // SQL query
    var sql = "SELECT STORENAME FROM grocerystore WHERE website='None'";
    db.query(sql, (error, results) => {
        if (error) {
            console.error(error);
            callback(error, null);
            return;
        }
        
        for (let i = 0; i < results.length; i++) {
            list.push(results[i].STORENAME);
        }
        
        callback(null, list);
    });
}

async function fetchWebsiteData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching website data:", error);
        return null;
    }
}

async function updateStoreWebsiteData() {
    try {
        const stores = await new Promise((resolve, reject) => {
            getItems((error, items) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(items);
                }
            });
        });
        
        const updatedStores = [];
        const baseURL = 'https://autocomplete.clearbit.com/v1/companies/suggest?query=';
        
        for (let i = 0; i < stores.length; i++) {
            const websiteData = await fetchWebsiteData(baseURL + encodeURIComponent(stores[i]));
            if (websiteData && websiteData.length > 0 && websiteData[0].domain) {
                updatedStores.push(stores[i]);
                
                // Update the database with the found website
                const updateSQL = "UPDATE grocerystore SET website = ? WHERE STORENAME = ?";
                db.query(updateSQL, [websiteData[0].domain, stores[i]], (error, results) => {
                    if (error) {
                        console.error("Error updating store:", stores[i], error);
                    }
                });
            }
        }
        
        console.log("Updated stores:", updatedStores);
    } catch (error) {
        console.error("Error updating stores:", error);
    }
}

updateStoreWebsiteData();
