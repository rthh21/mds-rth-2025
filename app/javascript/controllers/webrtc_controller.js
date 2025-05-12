import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["video", "localVideo", "remoteVideos", "muteButton", "videoButton", "chatInput"]
  
  connect() {
    this.peers = {}
    this.myPeer = new Peer(undefined, {
      host: '/',
      port: '3001'
    })
    
    this.myPeer.on('open', id => {
      this.userId = id
      this.roomId = this.element.dataset.roomId
      this.setupVideoStream()
      this.joinRoom()
    })
  }
  
  joinRoom() {
    this.socket = io.connect('http://localhost:2013')
    this.socket.emit('join-room', this.roomId, this.userId)
    
    this.socket.on('user-connected', userId => {
      console.log(`Utilizatorul ${userId} s-a conectat`)
      this.connectToNewUser(userId, this.myStream)
    })
    
    this.socket.on('user-disconnected', userId => {
      console.log(`Utilizatorul ${userId} s-a deconectat`)
      if (this.peers[userId]) this.peers[userId].close()
    })
    
    this.socket.on('createMessage', (message, userId) => {
      this.addMessageToChat(message, userId === this.userId ? 'mine' : 'other')
    })
  }
  
  setupVideoStream() {
    navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    }).then(stream => {
      this.myStream = stream
      this.addVideoStream(this.localVideoTarget, stream)
      
      this.myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
          this.addVideoStream(video, userVideoStream)
        })
      })
    }).catch(err => {
      console.error('Eroare la accesarea camerei și microfonului:', err)
      alert('Eroare la accesarea camerei și microfonului. Verificați permisiunile browserului.')
    })
  }
  
  connectToNewUser(userId, stream) {
    const call = this.myPeer.call(userId, stream)
    const video = document.createElement('video')
    
    call.on('stream', userVideoStream => {
      this.addVideoStream(video, userVideoStream)
    })
    
    call.on('close', () => {
      video.remove()
    })
    
    this.peers[userId] = call
  }
  
  addVideoStream(video, stream) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    this.remoteVideosTarget.append(video)
  }
  
  toggleMute() {
    const enabled = this.myStream.getAudioTracks()[0].enabled
    if (enabled) {
      this.myStream.getAudioTracks()[0].enabled = false
      this.muteButtonTarget.innerHTML = 'Unmute'
    } else {
      this.myStream.getAudioTracks()[0].enabled = true
      this.muteButtonTarget.innerHTML = 'Mute'
    }
  }
  
  toggleVideo() {
    const enabled = this.myStream.getVideoTracks()[0].enabled
    if (enabled) {
      this.myStream.getVideoTracks()[0].enabled = false
      this.videoButtonTarget.innerHTML = 'Start Video'
    } else {
      this.myStream.getVideoTracks()[0].enabled = true
      this.videoButtonTarget.innerHTML = 'Stop Video'
    }
  }
  
  sendMessage(event) {
    event.preventDefault()
    const message = this.chatInputTarget.value
    if (message.trim() === '') return
    
    this.socket.emit('message', message)
    this.chatInputTarget.value = ''
  }
  
  addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div')
    messageDiv.classList.add('message', sender)
    messageDiv.textContent = message
    document.querySelector('.chat-messages').appendChild(messageDiv)
    
    // Auto-scroll la cel mai recent mesaj
    const chatContainer = document.querySelector('.chat-messages')
    chatContainer.scrollTop = chatContainer.scrollHeight
  }
}
