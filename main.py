from flask import Flask
from flask_restful import Resource, Api
import time
import  threading
import  json
from flask_cors import CORS

app = Flask(__name__)
api = Api(app)
CORS(app)
dataset = {
    "online":[]
}

timelapse = {"sun":[]}


def check_online():
    while True:
        t = time.time()
        try:
            for item in dataset["online"]:
                if t - timelapse[item]>15:
                    dataset['online'].pop(dataset["online"].index(item))
                    timelapse.pop(item)


        except Exception as e:
            pass


def toggle_status(name,status):
    a = json.load(open("database.json"))
    a[name]["status"] = status
    json.dump(a, open("database.json",'w'))
    return True

def resetOnline():
    a = json.load(open("database.json"))
    try:
        for item in list(a.keys()):
            if item not in dataset["online"]:
                toggle_status(item , "offline")
            else:
                toggle_status(item,"online")

    except :
        pass


template = {"status": "online", "friends": [], "messages": {}}

class Online(Resource):
    def get(self,name):
        a = json.load(open("database.json"))
        if name in dataset["online"]:
            timelapse[name] = time.time()
        else:
            dataset["online"].append(name)
            timelapse[name] = time.time()
        if name not in list(a.keys()):
            a[name] = template
            json.dump(a,open("database.json",'w'))
        else:
            pass
        return {'success': True}

class friendRequest(Resource):
    def get(self,name,friend):
        a = json.load(open("friends.json"))
        if name not in  list(a.keys()):
            a[name] = [friend]
        else:
            a[name]+= [friend]
        json.dump(a, open("friends.json",'w'))

class acceptRequest(Resource):
    def get(self,name,friend):
        a = json.load(open("database.json"))
        if friend not in a[name]["friends"]:
            a[name]["friends"] += [friend]
            a[friend]["friends"] += [name]
        else:
            pass
        json.dump(a, open("database.json",'w'))


class newMessage(Resource):
    def get(self,name,target,message):
        a = json.load(open("database.json"))
        b = {}
        b["text"] = message
        b["time"] = str(__import__("datetime").datetime.now())
        a[target]["messages"][name] = b
        json.dump(a,open("database.json",'w'))

class getMessages(Resource):
    def get(self,name):
        return json.load(open("database.json"))[name]["messages"]

class getOnline(Resource):
    def get(self):
        return {'online':dataset["online"] ,"data":str(json.load(open("database.json","r")))   } , 201 , {"content-type":"application/json"}

class getFriends(Resource):
    def get(self,name):
        a = json.load(open("database.json"))
        b = a[name]["friends"]
        response = {}
        for i in b:
            try:
                response[i]=a[i]["status"]
            except:
                pass
        return response
class getFriendRequests(Resource):
    def get(self,name):
        a = json.load(open("friends.json"))
        return a[name]

api.add_resource(getFriendRequests,'/api/friends/requests/<string:name>')
api.add_resource(Online, '/api/online/refresh/<string:name>')
api.add_resource(getOnline,"/api/online")
api.add_resource(friendRequest,"/api/friends/request/<string:name>/<string:friend>")
api.add_resource(acceptRequest,"/api/friends/accept/<string:name>/<string:friend>")
api.add_resource(newMessage,"/api/messages/new/<string:name>/<string:target>/<string:message>")
api.add_resource(getMessages,"/api/messages/get/<string:name>")
api.add_resource(getFriends,"/api/friends/get/<string:name>")

class OnlineCheck(threading.Thread):
    def __init__(self, event):
        threading.Thread.__init__(self)
        self.stopped = event

    def run(self):
        while not self.stopped.wait(1.0):
            check_online()

class OnlineReset(threading.Thread):
    def __init__(self, event):
        threading.Thread.__init__(self)
        self.stopped = event

    def run(self):
        while not self.stopped.wait(1.0):
            resetOnline()


stopFlag = threading.Event()
thread = OnlineCheck(stopFlag)
thread2 = OnlineReset(stopFlag)
thread.start()
thread2.start()


if __name__ == '__main__':
    app.run(debug=True)
