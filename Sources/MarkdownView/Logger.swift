//
//  File.swift
//  
//
//  Created by 0x67 on 2023-06-28.
//

import Foundation
import OSLog


internal extension Logger{
  static let webViewLogger = Logger(subsystem: Bundle.main.bundleIdentifier ?? String(describing: type(of: MarkdownView.self)), category: "MarkdownView")
}
