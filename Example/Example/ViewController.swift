//
//  ViewController.swift
//  Example
//
//  Created by 0x67 on 2023-07-12.
//

import UIKit
import MarkdownView

class ViewController: UIViewController {
  
  var markdownView: MarkdownView!
  
  override func loadView() {
    markdownView = MarkdownView.init(css: "", plugins: [])
    markdownView.backgroundColor = .white
    view = markdownView
  }

  override func viewDidLoad() {
    super.viewDidLoad()
    markdownView.load(markdown: "Hello")
  }


}

