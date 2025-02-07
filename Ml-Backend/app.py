from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_pymongo import PyMongo
import numpy as np
from sklearn.cluster import KMeans

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# MongoDB configuration
app.config["MONGO_URI"] = "mongodb+srv://bytebonds:byte123456@clusterdb.mqjxv.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDB"
mongo = PyMongo(app)

# Route to fetch user locations and apply clustering
@app.route("/clustering", methods=["GET"])
def clustering():
    try:
        # Access the 'users' collection from MongoDB
        users_collection = mongo.db.users

        # Check if the users collection exists and is not None
        if not users_collection:
            return jsonify({"error": "Users collection not found."}), 404

        # Fetch user data from the 'users' collection
        users_cursor = users_collection.find()

        # If no users are found, return a message
        if users_cursor.count() == 0:
            return jsonify({"error": "No users found in the database."}), 404

        # Initialize an empty list to store user data
        users = []
        for user in users_cursor:
            lat = user.get("lat")
            lng = user.get("lng")
            if lat is not None and lng is not None:
                users.append({
                    "id": str(user["_id"]),
                    "lat": lat,
                    "lng": lng,
                    "name": user.get("name", "Unknown User")  # Add name for better debugging
                })

        if not users:
            return jsonify({"message": "No valid users found."}), 404

        # Log users for debugging
        print("Fetched users:", users)

        # Perform K-Means clustering (if users are available)
        locations = np.array([[u["lat"], u["lng"]] for u in users])
        kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
        kmeans.fit(locations)
        clusters = kmeans.labels_

        # Assign cluster IDs to each user
        for i, user in enumerate(users):
            user["cluster"] = int(clusters[i])

        # Return the users with their cluster info
        return jsonify(users)

    except Exception as e:
        # Return an error message if there's an issue in the code
        return jsonify({"error": str(e)}), 500


# Route to add a new user to MongoDB
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = data["password"]
    lat = data["location"]["lat"]
    lng = data["location"]["lng"]

    # Insert the new user into the 'users' collection
    users_collection = mongo.db.users  # 'users' collection in your database
    new_user = {
        "name": name,
        "email": email,
        "password": password,  # In a real app, hash the password!
        "lat": lat,
        "lng": lng
    }

    # Insert into MongoDB
    users_collection.insert_one(new_user)

    return jsonify({"message": "User registered successfully"}), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)
