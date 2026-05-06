import Foundation
import Vision
import AppKit

let args = CommandLine.arguments.dropFirst()
guard args.count >= 2 else {
    FileHandle.standardError.write(Data("Usage: swift ocr.swift image output\n".utf8))
    exit(2)
}

let imageURL = URL(fileURLWithPath: String(args[args.startIndex]))
let outputURL = URL(fileURLWithPath: String(args[args.index(after: args.startIndex)]))

guard let image = NSImage(contentsOf: imageURL),
      let tiff = image.tiffRepresentation,
      let bitmap = NSBitmapImageRep(data: tiff),
      let cgImage = bitmap.cgImage else {
    FileHandle.standardError.write(Data("Could not load image: \(imageURL.path)\n".utf8))
    exit(1)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true
request.recognitionLanguages = ["ja-JP", "en-US"]

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
try handler.perform([request])

let lines = (request.results ?? [])
    .compactMap { $0.topCandidates(1).first?.string }
    .joined(separator: "\n")

try lines.write(to: outputURL, atomically: true, encoding: .utf8)
