from http.client import HTTPException
from telnetlib import STATUS
from time import time
from typing import Optional
from fastapi import Body, FastAPI, Response
from pydantic import BaseModel
from random import randrange
import psycopg

app = FastAPI()

class Post(BaseModel):
    title: str
    content: str
    published: bool = True
    rating: Optional[int] = None

# Connect to an existing database
# with psycopg.connect("dbname=fastapi user=postgres password=asdfASDFasdf") as conn:
while True:
    try:
        conn = psycopg.connect("dbname=fastapi user=postgres password=") 
        cursor = conn.cursor()
        print("Database connection successful")
        break
    except Exception as error:
        print("Error", error)
        time.sleep(2)
        
        
@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/posts", status_code=201)
def get_posts():
    cursor.execute("""SELECT * FROM posts""")
    posts = cursor.fetchall()
    return {"data": posts}

@app.post("/posts")
def create_posts(post: Post):
    cursor.execute("""INSERT INTO posts(title, content, published) VALUES(%s, %s, %s) RETURNING * """, (post.title, post.content, post.published))
    new_post = cursor.fetchone()
    conn.commit()
    return {"data": new_post}

@app.get("/posts/{id}")
def get_post(id: int, response: Response):
    cursor.execute("""SELECT * from posts where id = (%s)""", (str(id),))
    post = cursor.fetchone()
    if post:
        return {"post" : post}
    else:
        response.status_code = 404
        # raise HTTPException(status_code=response.status_code, detail="No post found")
        return {"error": "No post found"}

@app.put("/posts/{id}")
def update_posts(post: Post):
    return {'message': 'updated Posts'}
    
    