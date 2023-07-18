//
//  ContentView.swift
//  sampleAEC
//
//  Created by 0x67 on 2023-07-14.
//

import SwiftUI
import AECAudioStream
import AVFAudio



struct ContentView: View {
  
  private let recordedFileURL = URL(fileURLWithPath: "input.caf", isDirectory: false, relativeTo: URL(fileURLWithPath: NSTemporaryDirectory()))

  let audioUnit = AECAudioStream(sampleRate: 48000)
  
  @State private var isRecording: Bool = false
  
  @State private var recordFile: AVAudioFile?
  
  @State private var recordingName:String? = nil
  
  init() {
    let fmt = AVAudioFormat(commonFormat: .pcmFormatInt16, sampleRate: 48000, channels: 1, interleaved: false)!
    let f = try? AVAudioFile(forWriting: recordedFileURL, settings: fmt.settings)
    self._recordFile = .init(initialValue: f)
    print(recordedFileURL)
  }
  
  var body: some View {
    VStack {
      Button {
        do{
          if isRecording{
            try audioUnit.stopAudioUnit()
            isRecording = false
          } else {
            isRecording = true
            Task{
              for try await pcmBuffer in audioUnit.startAudioStream(enableAEC: true) {
                // here you get a ``AVAudioPCMBuffer`` data
                debugPrint(pcmBuffer.isSilent)
              }
            }
          
          }
        } catch {
          print("Error: \(error.localizedDescription)")
        }
      } label: {
        Text(
          "Toggle Recording"
        )
      }

    }
    .padding()
  }
}

struct ContentView_Previews: PreviewProvider {
  static var previews: some View {
    ContentView()
  }
}


extension AVAudioPCMBuffer{
  var isSilent: Bool {
      if let int16ChannelData = int16ChannelData {
          for channel in 0 ..< format.channelCount {
              for frame in 0 ..< frameLength {
                if int16ChannelData[Int(channel)][Int(frame)] != Int16(0.0) {
                      return false
                  }
              }
          }
      }
      return true
  }
}
