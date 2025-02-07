from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from sklearn.cluster import KMeans
import numpy as np

app = Flask(__name__)

# Configure MongoDB connection
app.config["MONGO_URI"] = "mongodb+srv://bytebonds:byte123456@clusterdb.mqjxv.mongodb.net/?retryWrites=true&w=majority&appName=ClusterDB"
mongo = PyMongo(app)

@app.route('/clustering', methods=['GET'])
def clustering():
    """Fetch user locations from the database and apply K-Means clustering."""
    users_collection = mongo.db.users
    users_cursor = users_collection.find({}, {'_id': 0, 'name': 1, 'location': 1})
    
    # Extract user data from the database
    users = [{"name": user['name'], "lat": user['location']['lat'], "lng": user['location']['lng']} for user in users_cursor]
    
    # Ensure there are enough users to perform clustering
    if len(users) < 3:
        return jsonify({"error": "Not enough users for clustering"}), 400
    
    # Prepare location data for clustering
    locations = np.array([[user['lat'], user['lng']] for user in users])
    
    # Apply K-Means clustering algorithm
    kmeans = KMeans(n_clusters=3, random_state=42)
    kmeans.fit(locations)
    
    # Assign cluster labels to users
    for i, user in enumerate(users):
        user['cluster'] = int(kmeans.labels_[i])
    
    return jsonify(users)

if __name__ == "__main__":
    # Run Flask application
    app.run(debug=True, port=5000)
