"use client";

import React, { createContext, use, useContext, useEffect, useState} from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

const DatabaseProvider = ({children } ) => {
    const [posts, setPosts] = useState([]);
    const [parents, setParents] = useState([]);
    const [studentArticles, setStudentArticles] = useState([]);
    const [gallery, setGallery] = useState([]);
    
    useEffect(() => {
        const fetchParents = async () => {
          try {
            const response = await fetch('/api/users');
            const data = await response.json();
          
            setParents(data);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };

        const fetchPosts = async () => {
          try {
            const response = await fetch('/api/get-articles');
            const data = await response.json();
            console.log(data);
            setPosts(data);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        };

        const fetchGallery = async () => {
          try {
            const response = await fetch('/api/get-images');
            const data = await response.json();
            console.log(data);
            setGallery(data);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        };

        const fetchStudentArticles = async () => {
          try {
            const response = await fetch('/api/get-student-articles');
            const data = await response.json();
            console.log(data);
            setStudentArticles(data);
          } catch (error) {
            console.error('Error fetching posts:', error);
          }
        };


        fetchStudentArticles();
        fetchPosts();
        fetchParents();
        fetchGallery();
        
      }, []);
    
    

    const value = {
    parents,
    setParents,
    posts,
    setPosts,
    studentArticles,
    setStudentArticles,
    gallery,
    setGallery
};

    return (
            <DatabaseContext.Provider value={value}>
                {children}
            </DatabaseContext.Provider>
    );
}

export default DatabaseProvider;
